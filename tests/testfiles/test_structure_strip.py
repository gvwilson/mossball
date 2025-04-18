import pytest
import re
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

@pytest.mark.parametrize("start_marimo", ["tests/notebooks/structure_strip_test.py"], indirect=True)
def test_structure_strip_elements(get_chrome_driver, start_marimo, mock_server):
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    driver = get_chrome_driver
    driver.get(url)
    driver.maximize_window()
    
    # wait for plugin to load
    output_areas = WebDriverWait(driver, 30).until(
        EC.visibility_of_all_elements_located((By.CSS_SELECTOR, ".output-area"))
    )
    assert all(area.is_displayed() for area in output_areas)
    
    # Get shadow root
    shadow_hosts = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, "marimo-anywidget"))
    )
    assert len(shadow_hosts) >= 1

    found = False
    # Loop through each shadow host to locate the Structure Strip widget.
    for host in shadow_hosts:
        root = host.shadow_root
        try:
            # wait for the structure strip element in the shadow DOM
            widget = WebDriverWait(root, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "structure-strip"))
            )
            if widget:
                found = True
                # Check for the title element
                title = widget.find_element(By.CLASS_NAME, "structure-title")
                assert title.is_displayed()

                # Check for the description element
                description = widget.find_element(By.CLASS_NAME, "structure-description")
                assert description.is_displayed()
                
                # Check that at least one section is rendered
                sections = widget.find_elements(By.CLASS_NAME, "structure-section")
                assert len(sections) > 0

                for section in sections:
                    left_col = section.find_element(By.CLASS_NAME, "section-left")
                    right_col = section.find_element(By.CLASS_NAME, "section-content")
                    assert left_col.is_displayed()
                    assert right_col.is_displayed()
                    
                    # Check for prompt in the left column
                    prompt = left_col.find_element(By.CLASS_NAME, "section-prompt")
                    assert prompt.is_displayed()
                    
                    # Check for instruction dropdown in the left column
                    dropdowns = left_col.find_elements(By.CLASS_NAME, "instructions-dropdown")
                    assert len(dropdowns) > 0
                    
                    # Check for textarea in the right column
                    textareas = right_col.find_elements(By.TAG_NAME, "textarea")
                    assert len(textareas) > 0

                # Check that the button container exists.
                button_container = widget.find_element(By.CLASS_NAME, "button-container")
                assert button_container.is_displayed()

                # Check for a check button
                check_btn = button_container.find_element(By.CLASS_NAME, "check-button")
                assert check_btn.is_displayed()

                # Check for a copy button
                copy_btn = button_container.find_element(By.CLASS_NAME, "try-button")
                assert copy_btn.is_displayed()

                break
        except Exception:
            continue
    assert found

    process.terminate()
    process.wait()
    driver.quit()


@pytest.mark.parametrize("start_marimo", ["tests/notebooks/structure_strip_test.py"], indirect=True)
def test_structure_strip_incomplete_check(get_chrome_driver, start_marimo, mock_server):
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    driver = get_chrome_driver
    driver.get(url)
    driver.maximize_window()
    
    # wait for plugin to load
    output_areas = WebDriverWait(driver, 30).until(
        EC.visibility_of_all_elements_located((By.CSS_SELECTOR, ".output-area"))
    )
    assert all(area.is_displayed() for area in output_areas)
    
    # Get shadow root
    shadow_hosts = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, "marimo-anywidget"))
    )
    assert len(shadow_hosts) >= 1

    widget_found = False
    # Loop over shadow hosts to find the Structure Strip widget.
    for host in shadow_hosts:
        root = host.shadow_root
        try:
            widget = WebDriverWait(root, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "structure-strip"))
            )
        except Exception:
            continue
        
        if widget:
            widget_found = True
            header = widget.find_element(By.CLASS_NAME, "structure-title")
            assert header.is_displayed()
            description = widget.find_element(By.CLASS_NAME, "structure-description")
            assert description.is_displayed()
            sections = widget.find_elements(By.CLASS_NAME, "structure-section")
            assert len(sections) > 0
            
            for section in sections:
                left_col = section.find_element(By.CLASS_NAME, "section-left")
                right_col = section.find_element(By.CLASS_NAME, "section-content")
                assert left_col.is_displayed(), "Left column not displayed"
                assert right_col.is_displayed(), "Right column not displayed"
                
                # Click the question button to expand the instructions dropdown
                question_btn = left_col.find_element(By.CLASS_NAME, "question-btn")
                question_btn.click()
                
                # Wait for the instructions dropdown to become active and contain the number of minimum characters
                dropdown = WebDriverWait(left_col, 5).until(
                    lambda el: "Minimum characters:" in el.find_element(By.CLASS_NAME, "instructions-dropdown").text
                )
                dropdown = left_col.find_element(By.CLASS_NAME, "instructions-dropdown")
                dropdown_text = dropdown.text
                match = re.search(r"Minimum characters:\s*(\d+)", dropdown_text)
                assert match, f"Could not get max length from dropdown: {dropdown_text}"
                max_length = int(match.group(1))
                
                # Fill in the textarea with a short text that is less than the minimum required characters
                textarea = right_col.find_element(By.TAG_NAME, "textarea")
                textarea.clear()
                textarea.send_keys("Lorem ipsum")
                
                # Check that character counter is updated correctly
                counter = right_col.find_element(By.CLASS_NAME, "char-counter")
                assert "11" in counter.text, f"Expected counter to show 11, instead got: {counter.text}"
            
            # Click the check button
            button_container = widget.find_element(By.CLASS_NAME, "button-container")
            check_button = button_container.find_element(By.CLASS_NAME, "check-button")
            assert check_button.is_displayed()
            check_button.click()
            time.sleep(0.5)
            
            # For each section check the feedback text
            for section in sections:
                left_col = section.find_element(By.CLASS_NAME, "section-left")
                dropdown = left_col.find_element(By.CLASS_NAME, "instructions-dropdown")
                dropdown_text = dropdown.text
                match = re.search(r"Minimum characters:\s*(\d+)", dropdown_text)
                max_length = int(match.group(1))
                expected_remaining = max_length - 11
                expected_message = f"Need at least {expected_remaining} more characters"
                feedback = section.find_element(By.CLASS_NAME, "feedback")
                WebDriverWait(section, 10).until(lambda s: feedback.text.strip() != "")
                feedback_text = feedback.text.strip()
                assert feedback_text == expected_message, f"Expected '{expected_message}', got '{feedback_text}'"
            break
    assert widget_found
    
    process.terminate()
    process.wait()
    driver.quit()


@pytest.mark.parametrize("start_marimo", ["tests/notebooks/structure_strip_test.py"], indirect=True)
def test_structure_strip_complete_check(get_chrome_driver, start_marimo, mock_server):
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    driver = get_chrome_driver
    driver.get(url)
    driver.maximize_window()
    
    # wait for plugin to load
    shadow_hosts = WebDriverWait(driver, 30).until(
         EC.presence_of_all_elements_located((By.CSS_SELECTOR, "marimo-anywidget"))
    )
    assert len(shadow_hosts) >= 1

    widget_found = False
    # Loop over shadow hosts to find the Structure Strip widget.
    for host in shadow_hosts:
        root = host.shadow_root
        try:
            widget = WebDriverWait(root, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "structure-strip"))
            )
        except Exception:
            continue
        
        if widget:
            widget_found = True
            sections = widget.find_elements(By.CLASS_NAME, "structure-section")
            assert len(sections) > 0
            
            # Make a long text that satisfies minimum requirements
            complete_text = (
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula massa at purus "
                "ullamcorper, ut faucibus nulla tincidunt. Sed accumsan mi vitae eros feugiat, sed convallis "
                "libero ullamcorper. Proin a justo nec erat fermentum volutpat. Vestibulum ante ipsum primis in "
                "faucibus orci luctus et ultrices posuere cubilia curae; Duis non felis euismod, tincidunt orci "
                "non, pulvinar elit. Praesent fermentum neque eget urna tincidunt, sed gravida felis malesuada. "
                "Quisque id libero et metus gravida feugiat. Nam eget odio auctor, hendrerit leo at, blandit "
                "felis. Suspendisse potenti. Praesent a interdum magna. Cras ullamcorper magna non nisi convallis, "
                "vel cursus magna ultrices. Curabitur tincidunt eros a turpis volutpat, in auctor justo tempor. "
                "Donec ac consequat lorem. Suspendisse eget ultrices sem. Sed non sem non leo aliquet ultricies. "
                "Integer sit amet risus nec velit efficitur bibendum. Curabitur non orci vitae urna volutpat "
                "ultrices a eget quam. Phasellus scelerisque, mi a dignissim mollis, enim turpis vestibulum neque, "
                "id bibendum sapien libero ut dui. Sed nec ligula id nunc efficitur varius. "
            )
            
            for section in sections:
                left_col = section.find_element(By.CLASS_NAME, "section-left")
                question_btn = left_col.find_element(By.CLASS_NAME, "question-btn")
                question_btn.click()
                dropdown = WebDriverWait(left_col, 5).until(
                    lambda el: "Minimum characters:" in el.find_element(By.CLASS_NAME, "instructions-dropdown").text
                )
                dropdown = left_col.find_element(By.CLASS_NAME, "instructions-dropdown")
                dropdown_text = dropdown.text
                match = re.search(r"Minimum characters:\s*(\d+)", dropdown_text)
                assert match, f"Could not get max length from dropdown: {dropdown_text}"
                max_length = int(match.group(1))
                # Check for the complete text satisfies the minimum requirement
                assert len(complete_text) >= max_length, f"Complete text is too short: {len(complete_text)} < {max_length}"
                
                right_col = section.find_element(By.CLASS_NAME, "section-content")
                textarea = right_col.find_element(By.TAG_NAME, "textarea")
                textarea.clear()
                textarea.send_keys(complete_text)
                
                # Check that character counter is updated correctly
                counter = right_col.find_element(By.CLASS_NAME, "char-counter")
                assert str(len(complete_text)) in counter.text, f"Counter does not show {len(complete_text)}"

            button_container = widget.find_element(By.CLASS_NAME, "button-container")
            check_button = button_container.find_element(By.CLASS_NAME, "check-button")
            assert check_button.is_displayed()
            check_button.click()
            time.sleep(0.5)
            
            # For each section check the feedback text
            for section in sections:
                feedback = section.find_element(By.CLASS_NAME, "feedback")
                WebDriverWait(section, 10).until(lambda s: feedback.text.strip() != "")
                feedback_text = feedback.text.strip()
                expected_message = "Section complete!"
                assert feedback_text == expected_message, f"Expected '{expected_message}', got '{feedback_text}'"
            break
    assert widget_found
    
    process.terminate()
    process.wait()
    driver.quit()


@pytest.mark.parametrize("start_marimo", ["tests/notebooks/structure_strip_test.py"], indirect=True)
def test_structure_strip_copy_button(get_chrome_driver, start_marimo, mock_server):
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    driver = get_chrome_driver
    driver.get(url)
    driver.maximize_window()
    
    # wait for plugin to load
    shadow_hosts = WebDriverWait(driver, 30).until(
         EC.presence_of_all_elements_located((By.CSS_SELECTOR, "marimo-anywidget"))
    )
    assert len(shadow_hosts) >= 1

    widget_found = False
    for host in shadow_hosts:
        root = host.shadow_root
        try:
            widget = WebDriverWait(root, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "structure-strip"))
            )
        except Exception:
            continue
        
        if widget:
            widget_found = True
            # Check for Copy button in the button container
            button_container = widget.find_element(By.CLASS_NAME, "button-container")
            copy_btn = button_container.find_element(By.CLASS_NAME, "try-button")
            assert copy_btn.is_displayed(), "Copy button not visible"
            copy_btn.click()

            # Check if it changes to Copied
            WebDriverWait(driver, 5).until(
                lambda d: copy_btn.text.strip() == "Copied"
            )
            assert copy_btn.text.strip() == "Copied"

            # Check if it reverts back to Copy
            WebDriverWait(driver, 5).until(
                lambda d: copy_btn.text.strip() == "Copy"
            )
            assert copy_btn.text.strip() == "Copy"
            break
    assert widget_found
    
    process.terminate()
    process.wait()
    driver.quit()