import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains


@pytest.mark.parametrize("start_marimo", ["tests/notebooks/find_the_words_untimed_test.py"], indirect=True)
def test_find_the_words_untimed(get_chrome_driver, start_marimo):
    chrome_driver = get_chrome_driver

    # run the following notebook (marimo run tests/notebooks/find_the_words_untimed.py)
    # get the url
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    time.sleep(2)

    chrome_driver.get(url)
    chrome_driver.maximize_window()

    # get notebook title
    title = chrome_driver.title
    assert title == "find the words untimed test"

    # wait for plugin to load
    output_area = WebDriverWait(chrome_driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".output-area"))
    )
    output_area.is_displayed()

    # Get shadow root
    shadow_host = get_chrome_driver.find_element(
        By.CSS_SELECTOR, "marimo-anywidget")
    marimo_root = shadow_host.shadow_root

    # Get widget container
    container = WebDriverWait(marimo_root, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".container"))
    )
    assert container.is_displayed()

    # Check end game button appears
    end_game_button = container.find_element(
        By.CSS_SELECTOR, "#end-button"
    )
    assert end_game_button.is_displayed()
    assert end_game_button.get_attribute("innerText") == "End Game"

    # Test dragging to select words
    word_bank = container.find_element(
        By.CSS_SELECTOR, ".word-bank"
    )
    words = word_bank.find_elements(
        By.CSS_SELECTOR, ".word"
    )
    assert len(words) == 4

    # Find word orange
    start_cell = container.find_element(
        By.CSS_SELECTOR, ".grid-cell[data-row='5'][data-col='8']")
    end_cell = container.find_element(
        By.CSS_SELECTOR, ".grid-cell[data-row='5'][data-col='13']")

    ActionChains(chrome_driver).drag_and_drop(start_cell, end_cell).perform()

    # Check word counter is updated
    score_counter = container.find_element(
        By.CSS_SELECTOR, ".score-counter"
    )
    assert score_counter.get_attribute("innerText") == "1 of 4 words found"

    # Check the word appears as found in the word bank
    feedback = word_bank.find_element(
        By.CSS_SELECTOR, "#orange"
    )
    assert feedback.get_attribute("data-state") == "found"

    # Test end game
    ActionChains(chrome_driver).move_to_element(
        end_game_button).click().perform()

    # find the modal
    modalConfirmButton = WebDriverWait(chrome_driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".swal2-confirm"))
    )
    modalConfirmButton.click()

    # Check states are reset
    for word in words:
        # words have no data attribute
        assert not word.get_attribute("data-state")

    assert score_counter.get_attribute("innerText") == "0 of 4 words found"

    # no selection svg on the page
    assert not container.find_elements(
        By.CSS_SELECTOR, ".selection-svg"
    )

    process.terminate()
    process.wait()
    chrome_driver.quit()


@pytest.mark.parametrize("start_marimo", ["tests/notebooks/find_the_words_timed_test.py"], indirect=True)
def test_find_the_words_timed(get_chrome_driver, start_marimo):
    chrome_driver = get_chrome_driver

    # run the following notebook (marimo run tests/notebooks/find_the_words_untimed.py)
    # get the url
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    time.sleep(2)

    chrome_driver.get(url)
    chrome_driver.maximize_window()

    # get notebook title
    title = chrome_driver.title
    assert title == "find the words timed test"

    # wait for plugin to load
    output_area = WebDriverWait(chrome_driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".output-area"))
    )
    output_area.is_displayed()

    # Get shadow root
    shadow_host = get_chrome_driver.find_element(
        By.CSS_SELECTOR, "marimo-anywidget")
    marimo_root = shadow_host.shadow_root

    # Get widget container
    container = marimo_root.find_element(
        By.CSS_SELECTOR, ".container")
    assert container.is_displayed()

    start_button = container.find_element(
        By.CSS_SELECTOR, "#start-button"
    )
    assert start_button.is_displayed()
    assert start_button.get_attribute("innerText") == "Start Game"
    ActionChains(chrome_driver).move_to_element(start_button).click().perform()

    # Check end game button appears
    end_game_button = container.find_element(
        By.CSS_SELECTOR, "#end-button"
    )
    assert end_game_button.is_displayed()
    assert end_game_button.get_attribute("innerText") == "End Game"

    # Test dragging to select words
    word_bank = container.find_element(
        By.CSS_SELECTOR, ".word-bank"
    )
    words = word_bank.find_elements(
        By.CSS_SELECTOR, ".word"
    )
    assert len(words) == 4

    # Find word orange
    start_cell = container.find_element(
        By.CSS_SELECTOR, ".grid-cell[data-row='5'][data-col='8']")
    end_cell = container.find_element(
        By.CSS_SELECTOR, ".grid-cell[data-row='5'][data-col='13']")

    ActionChains(chrome_driver).drag_and_drop(start_cell, end_cell).perform()

    # Check word counter is updated
    score_counter = container.find_element(
        By.CSS_SELECTOR, ".score-counter"
    )
    assert score_counter.get_attribute("innerText") == "1 of 4 words found"

    # Check the word appears as found in the word bank
    feedback = word_bank.find_element(
        By.CSS_SELECTOR, "#orange"
    )
    assert feedback.get_attribute("data-state") == "found"

    # Test end game
    ActionChains(chrome_driver).move_to_element(
        end_game_button).click().perform()

    # find the modal
    modalConfirmButton = WebDriverWait(chrome_driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".swal2-confirm"))
    )
    modalConfirmButton.click()

    # Check states are reset
    for word in words:
        # words have no data attribute
        assert not word.get_attribute("data-state")

    assert score_counter.get_attribute("innerText") == "0 of 4 words found"

    # no selection svg on the page
    assert not container.find_elements(
        By.CSS_SELECTOR, ".selection-svg"
    )

    process.terminate()
    process.wait()
    chrome_driver.quit()
