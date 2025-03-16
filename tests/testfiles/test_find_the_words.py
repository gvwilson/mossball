import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains


@pytest.mark.parametrize("start_marimo", ["lorena-b/find-the-words/demo.py"], indirect=True)
def test_find_the_words(get_chrome_driver, start_marimo):
    chrome_driver = get_chrome_driver

    # run the following notebook (marimo run lorena-b/find-the-words/demo.py)
    # get the url
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    time.sleep(2)

    chrome_driver.get(url)
    chrome_driver.maximize_window()

    # get notebook title
    title = chrome_driver.title
    assert title == "demo"

    # wait for plugin to load
    # TODO: find a way to not use timeouts
    output_area = WebDriverWait(chrome_driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".output-area"))
    )
    output_area.is_displayed()

    # get shadow root
    shadow_host = get_chrome_driver.find_element(
        By.CSS_SELECTOR, "marimo-anywidget")
    marimo_root = shadow_host.shadow_root

    # get widget container
    container = marimo_root.find_element(
        By.CSS_SELECTOR, ".container")
    assert container.is_displayed()

    start_button = container.find_element(
        By.CSS_SELECTOR, "#start-button"
    )
    assert start_button.is_displayed()
    assert start_button.get_attribute("innerText") == "Start Game"
    ActionChains(chrome_driver).move_to_element(start_button).click().perform()

    # check end game button appears
    end_game_button = container.find_element(
        By.CSS_SELECTOR, "#end-button"
    )
    assert end_game_button.is_displayed()
    assert end_game_button.get_attribute("innerText") == "End Game"

    # test dragging words
    word_bank = container.find_element(
        By.CSS_SELECTOR, ".word-bank"
    )
    words = word_bank.find_elements(
        By.CSS_SELECTOR, ".word"
    )
    assert len(words) == 4

    # select a word
    


    process.terminate()
    process.wait()
    chrome_driver.quit()
