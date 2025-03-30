import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.actions.mouse_button import MouseButton
from selenium.webdriver.common.actions.action_builder import ActionBuilder
from selenium.webdriver import ActionChains
import time

# test both backend and non-backend plugins
@pytest.mark.parametrize("start_marimo", ["tests/notebooks/multiple_choice_question.py"], indirect=True)
def test_basic_structure(get_chrome_driver, start_marimo, mock_server):
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    get_chrome_driver.get(url)

    # wait for plugin to load
    output_areas = WebDriverWait(get_chrome_driver, 30).until(
        EC.visibility_of_all_elements_located((By.CSS_SELECTOR, ".output-area"))
    )
    assert all(output_area.is_displayed() for output_area in output_areas)

    # Get shadow root
    shadow_hosts = WebDriverWait(get_chrome_driver, 10).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, "marimo-anywidget"))
    )
    assert len(shadow_hosts) == 2

    for shadow_host in shadow_hosts:
        marimo_root = shadow_host.shadow_root
        widget = WebDriverWait(marimo_root, 10).until(
            EC.visibility_of_element_located((By.CLASS_NAME, "mc"))
        )
        assert widget.is_displayed()
        
        title = widget.find_element(By.CLASS_NAME, "title")
        assert title.is_displayed()
        assert len(title.get_attribute("innerText")) > 0

        options = widget.find_elements(By.CLASS_NAME, "choice")
        assert len(options) > 0
        assert all(option.is_displayed() for option in options)

        for option in options:
            radio_button = option.find_element(By.CSS_SELECTOR, "input[type='radio']")
            label = option.find_element(By.CLASS_NAME, "label")
            assert radio_button.is_displayed()
            assert label.is_displayed()

        check_button = widget.find_element(By.CLASS_NAME, "check-button")
        try_button = widget.find_element(By.CLASS_NAME, "try-button")

        assert check_button.is_displayed() and not try_button.is_displayed()
    
    process.terminate()
    process.wait()
    get_chrome_driver.quit()


# for both backend and non-backend plugins
@pytest.mark.parametrize("start_marimo", ["tests/notebooks/multiple_choice_question.py"], indirect=True)
def test_answer_success(get_chrome_driver, start_marimo, mock_server):
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    get_chrome_driver.get(url)

    # wait for plugin to load
    output_areas = WebDriverWait(get_chrome_driver, 30).until(
        EC.visibility_of_all_elements_located((By.CSS_SELECTOR, ".output-area"))
    )
    assert all(output_area.is_displayed() for output_area in output_areas)

    # Get shadow root
    shadow_hosts = WebDriverWait(get_chrome_driver, 10).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, "marimo-anywidget"))
    )
    assert len(shadow_hosts) == 2

    correct_answers = [1, 2]

    for index, shadow_host in enumerate(shadow_hosts):
        marimo_root = shadow_host.shadow_root
        widget = WebDriverWait(marimo_root, 10).until(
            EC.visibility_of_element_located((By.CLASS_NAME, "mc"))
        )
        assert widget.is_displayed()
        
        title = widget.find_element(By.CLASS_NAME, "title")
        assert title.is_displayed()

        options = widget.find_elements(By.CLASS_NAME, "choice")
        assert len(options) > 0
        assert all(option.is_displayed() for option in options)

        for i, option in enumerate(options):
            radio_button = option.find_element(By.CSS_SELECTOR, "input[type='radio']")
            label = option.find_element(By.CLASS_NAME, "label")
            assert radio_button.is_displayed()
            assert label.is_displayed()

            if i == correct_answers[index]:
                radio_button.click()

        check_button = widget.find_element(By.CLASS_NAME, "check-button")
        assert check_button.is_displayed()
        check_button.click()
        time.sleep(0.5)

        score_text = widget.find_element(By.CLASS_NAME, "result")
        assert score_text.is_displayed()
        assert "Correct!" in score_text.get_attribute("innerText")

        retry_button = widget.find_element(By.CLASS_NAME, "try-button")
        assert not retry_button.is_displayed()

        options = widget.find_elements(By.CLASS_NAME, "choice")
        assert all("disabled" in option.get_attribute("class") for option in options)
        assert options[correct_answers[index]].get_attribute("id") == "correct"
    
    process.terminate()
    process.wait()
    get_chrome_driver.quit()


# for non-backend supported plugin
@pytest.mark.parametrize("start_marimo", ["tests/notebooks/multiple_choice_question.py"], indirect=True)
def test_answer_failure(get_chrome_driver, start_marimo, mock_server):
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    get_chrome_driver.get(url)

    # wait for plugin to load
    output_areas = WebDriverWait(get_chrome_driver, 30).until(
        EC.visibility_of_all_elements_located((By.CSS_SELECTOR, ".output-area"))
    )
    assert all(output_area.is_displayed() for output_area in output_areas)

    # Get shadow root
    shadow_hosts = WebDriverWait(get_chrome_driver, 10).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, "marimo-anywidget"))
    )
    assert len(shadow_hosts) == 2

    shadow_host = shadow_hosts[1]
    marimo_root = shadow_host.shadow_root
    widget = WebDriverWait(marimo_root, 10).until(
        EC.visibility_of_element_located((By.CLASS_NAME, "mc"))
    )
    assert widget.is_displayed()
    
    title = widget.find_element(By.CLASS_NAME, "title")
    assert title.is_displayed()

    options = widget.find_elements(By.CLASS_NAME, "choice")
    assert len(options) > 0
    assert all(option.is_displayed() for option in options)

    wrong_option = options[0]
    radio_button = wrong_option.find_element(By.CSS_SELECTOR, "input[type='radio']")
    label = wrong_option.find_element(By.CLASS_NAME, "label")
    assert radio_button.is_displayed()
    assert label.is_displayed()
    
    radio_button.click()

    check_button = widget.find_element(By.CLASS_NAME, "check-button")
    assert check_button.is_displayed()
    check_button.click()
    time.sleep(0.5)

    options = widget.find_elements(By.CLASS_NAME, "choice")
    assert all("disabled" in option.get_attribute("class") for option in options)
    assert options[0].get_attribute("id") == "incorrect"

    score_text = widget.find_element(By.CLASS_NAME, "result")
    assert score_text.is_displayed()
    assert "Incorrect" == score_text.get_attribute("innerText")

    retry_button = widget.find_element(By.CLASS_NAME, "try-button")
    assert retry_button.is_displayed()
    retry_button.click()

    options = widget.find_elements(By.CLASS_NAME, "choice")
    assert all("disabled" not in option.get_attribute("class") for option in options)
    assert "incorrect" not in options[0].get_attribute("id")

    process.terminate()
    process.wait()
    get_chrome_driver.quit()