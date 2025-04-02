import pytest
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
