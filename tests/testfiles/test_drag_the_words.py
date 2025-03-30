import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.actions.mouse_button import MouseButton
from selenium.webdriver.common.actions.action_builder import ActionBuilder
from selenium.webdriver import ActionChains
import time

@pytest.mark.parametrize("start_marimo", ["tests/notebooks/drag_the_words_simple.py"], indirect=True)
def test_basic_structure(get_chrome_driver, start_marimo, mock_server):
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    print("check url: ", url)
    get_chrome_driver.get(url)

    output_area = WebDriverWait(get_chrome_driver, 30).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".output-area")))
    print(output_area)
    shadow_hosts = get_chrome_driver.find_elements(By.CSS_SELECTOR, "marimo-anywidget")
    assert len(shadow_hosts) == 2

    for shadow_host in shadow_hosts:
        marimo_root = shadow_host.shadow_root
        widget = marimo_root.find_element(By.CLASS_NAME, "drag-words-widget")
        title = widget.find_element(By.CLASS_NAME, "title")
        assert title.get_attribute("innerText") == "Drag the words to the correct positions"

        question = widget.find_element(By.CLASS_NAME, "question")
        assert question.is_displayed() == True

        words_container = widget.find_element(By.CLASS_NAME, "words-container")
        assert words_container.is_displayed() == True

        words = words_container.find_elements(By.CLASS_NAME, "word-box")
        assert len(words) > 0

        bottom_banner = widget.find_element(By.CLASS_NAME, "bottom-banner")
        assert bottom_banner.is_displayed() == True

        check_button = bottom_banner.find_element(By.CLASS_NAME, "check-button")
        reset_button = bottom_banner.find_element(By.CLASS_NAME, "try-button")

        assert check_button.is_displayed() and reset_button.is_displayed()
    
    process.terminate()
    process.wait()
    get_chrome_driver.quit()


@pytest.mark.parametrize("start_marimo", ["tests/notebooks/drag_the_words_simple.py"], indirect=True)
def test_drag_words(get_chrome_driver, start_marimo, mock_server):
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    get_chrome_driver.get(url)
    # get_chrome_driver.maximize_window()
    # Wait for the browser to settle all the required DOMs
    output_area = WebDriverWait(get_chrome_driver, 30).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".output-area")))

    shadow_hosts = get_chrome_driver.find_elements(By.CSS_SELECTOR, "marimo-anywidget")
    assert len(shadow_hosts) == 2

    actual_answers = [
        ["processes", "scheduling algorithms", "memory allocation", "resources", "deadlocks", "preemption"],
        ["light","water","light","heat","energy","water","heat","light"]
    ]

    # Running both backend support and non-backend support plugins
    for index, shadow_host in enumerate(shadow_hosts):
        # shadow_host = get_chrome_driver.find_element(By.CSS_SELECTOR, "marimo-anywidget")
        marimo_root = shadow_host.shadow_root
        widget = marimo_root.find_element(By.CLASS_NAME, "drag-words-widget")
        
        question = widget.find_element(By.CLASS_NAME, "question")
        blank_answers = question.find_elements(By.CLASS_NAME, "blank")
        words_container = widget.find_element(By.CLASS_NAME, "words-container")
        assert words_container.is_displayed() == True

        words = words_container.find_elements(By.CLASS_NAME, "word-box")
        assert len(words) > 0

        # Verify that all the words are draggable and drop to the elements correctly
        for i in range(len(words)):
            draggable = words[i]
            droppable = blank_answers[i]

            ActionChains(get_chrome_driver).drag_and_drop(draggable, droppable).perform()

            if actual_answers[index].count(draggable.get_attribute("innerText")) == 1:
                assert draggable.get_attribute("draggable") == "false"
            else:
                assert draggable.get_attribute("draggable") == "true"
            assert droppable.get_attribute("class") == "filled"
            assert droppable.get_attribute("innerText") == draggable.get_attribute("innerText")
            assert droppable.find_element(By.ID, f"remove-{droppable.get_attribute('id')}").is_displayed()

        # Click the reset button
        bottom_banner = widget.find_element(By.CLASS_NAME, "bottom-banner")
        reset_button = bottom_banner.find_element(By.CLASS_NAME, "try-button")
        
        assert reset_button.is_displayed()
        reset_button.click()

        for i in range(len(words)):
            draggable = words[i]
            droppable = blank_answers[i]

            assert draggable.get_attribute("draggable") == "true"
            assert droppable.get_attribute("class") == "blank"
            assert droppable.get_attribute("innerText") == ''
            assert len(droppable.find_elements(By.ID, f"remove-{droppable.get_attribute('id')}")) == 0

    process.terminate()
    process.wait()
    get_chrome_driver.quit()


@pytest.mark.parametrize("start_marimo", ["tests/notebooks/drag_the_words_simple.py"], indirect=True)
def test_answer_success(get_chrome_driver, start_marimo, mock_server):
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    get_chrome_driver.get(url)
    # get_chrome_driver.maximize_window()
    # Wait for the browser to settle all the required DOMs
    output_area = WebDriverWait(get_chrome_driver, 30).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".output-area")))

    correct_answers = [{
        "processes": [0], 
        "scheduling algorithms": [1], 
        "memory allocation": [2],
        "resources": [3] , "deadlocks": [4], "preemption": [5]
    }, {
        "light": [0, 2, 7],
        "water": [1, 5],
        "heat": [3, 6],
        "energy": [4]
    }]

    shadow_hosts = get_chrome_driver.find_elements(By.CSS_SELECTOR, "marimo-anywidget")

    for index, shadow_host in enumerate(shadow_hosts):
        marimo_root = shadow_host.shadow_root
        widget = marimo_root.find_element(By.CLASS_NAME, "drag-words-widget")
        
        question = widget.find_element(By.CLASS_NAME, "question")
        words_container = widget.find_element(By.CLASS_NAME, "words-container")
        assert words_container.is_displayed() == True

        words = words_container.find_elements(By.CLASS_NAME, "word-box")
        assert len(words) > 0

        for i in range(len(words)):
            draggable = words[i]
            draggable_text = draggable.get_attribute("innerText")
            for j in correct_answers[index][draggable_text]:
                droppable_id = f"answer-{j}"
                droppable = question.find_element(By.ID, droppable_id)

                ActionChains(get_chrome_driver).drag_and_drop(draggable, droppable).perform()

                assert droppable.get_attribute("class") == "filled"
                assert droppable.get_attribute("innerText") == draggable.get_attribute("innerText")
                assert droppable.find_element(By.ID, f"remove-{droppable_id}").is_displayed()
            
            assert draggable.get_attribute("draggable") == "false"

        # Click the reset button
        bottom_banner = widget.find_element(By.CLASS_NAME, "bottom-banner")
        check_button = bottom_banner.find_element(By.CLASS_NAME, "check-button")

        assert check_button.is_displayed()
        check_button.click()
        time.sleep(0.5)

        filled_answers = question.find_elements(By.CLASS_NAME, "filled")
        for droppable in filled_answers:
            assert "correct" in droppable.get_attribute("class")
    
    process.terminate()
    process.wait()
    get_chrome_driver.quit()

@pytest.mark.parametrize("start_marimo", ["tests/notebooks/drag_the_words_simple.py"], indirect=True)
def test_answer_failure(get_chrome_driver, start_marimo, mock_server):
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    get_chrome_driver.get(url)
    # get_chrome_driver.maximize_window()
    # Wait for the browser to settle all the required DOMs
    output_area = WebDriverWait(get_chrome_driver, 30).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".output-area")))

    incorrect_answers = {
        "light": [0, 2, 4],
        "water": [1, 6],
        "heat": [3, 5],
        "energy": [7]
    }

    shadow_host = get_chrome_driver.find_elements(By.CSS_SELECTOR, "marimo-anywidget")[1]
    marimo_root = shadow_host.shadow_root
    widget = marimo_root.find_element(By.CLASS_NAME, "drag-words-widget")
    
    question = widget.find_element(By.CLASS_NAME, "question")
    words_container = widget.find_element(By.CLASS_NAME, "words-container")
    assert words_container.is_displayed() == True

    words = words_container.find_elements(By.CLASS_NAME, "word-box")
    assert len(words) > 0

    for i in range(len(words)):
        draggable = words[i]
        draggable_text = draggable.get_attribute("innerText")
        for j in incorrect_answers[draggable_text]:
            droppable_id = f"answer-{j}"
            droppable = question.find_element(By.ID, droppable_id)

            ActionChains(get_chrome_driver).drag_and_drop(draggable, droppable).perform()

            assert droppable.get_attribute("class") == "filled"
            assert droppable.get_attribute("innerText") == draggable.get_attribute("innerText")
            assert droppable.find_element(By.ID, f"remove-{droppable_id}").is_displayed()
        
        assert draggable.get_attribute("draggable") == "false"

    # Click the reset button
    bottom_banner = widget.find_element(By.CLASS_NAME, "bottom-banner")
    check_button = bottom_banner.find_element(By.CLASS_NAME, "check-button")

    assert check_button.is_displayed()
    check_button.click()
    time.sleep(0.5)

    filled_answers = question.find_elements(By.CLASS_NAME, "filled")
    for i, droppable in enumerate(filled_answers):
        if i < 4:
            assert "correct" in droppable.get_attribute("class")
        else:
            assert "incorrect" in droppable.get_attribute("class")
    
    retry_button = bottom_banner.find_element(By.CLASS_NAME, "try-button")

    assert retry_button.is_displayed()
    retry_button.click()
    time.sleep(0.5)

    correct_answers = ["light","water","light","heat","energy","water","heat","light"]

    for i in range(8):
        answer_box = question.find_element(By.ID, f"answer-{i}")

        if i < 4:
            assert "filled" in answer_box.get_attribute("class")
            assert "correct" in answer_box.get_attribute("class")
            assert answer_box.get_attribute("innerText") == correct_answers[i]
            assert len(answer_box.find_elements(By.ID, f"remove-{answer_box.get_attribute('id')}")) == 0
        else:
            assert "blank" == answer_box.get_attribute("class")
            assert answer_box.get_attribute("innerText") == ''
            assert len(answer_box.find_elements(By.ID, f"remove-{answer_box.get_attribute('id')}")) == 0

    process.terminate()
    process.wait()
    get_chrome_driver.quit()