import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

@pytest.mark.order(1)
@pytest.mark.parametrize("start_marimo", ["eun-chae-s/drag-the-words/implementation/drag_the_words.py"], indirect=True)
def test_page_setup(get_chrome_driver, start_marimo):
    # run the following notebook (marimo run eun-chae-s/drag-the-words/implementation/drag_the_words.py)
    # achieve the url
    url = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    time.sleep(2)

    get_chrome_driver.get(url)
    get_chrome_driver.maximize_window()
    
    # check that the question is visible
    title = get_chrome_driver.title
    assert title == "drag the words"

@pytest.mark.order(2)
@pytest.mark.parametrize("start_marimo", ["eun-chae-s/drag-the-words/implementation/drag_the_words.py"], indirect=True)
def test_basic_structure(get_chrome_driver, start_marimo):
    url = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    get_chrome_driver.get(url)
    get_chrome_driver.maximize_window()
    # Wait for the browser to settle all the required DOMs
    # TODO: find the reliable way to select the element
    WebDriverWait(get_chrome_driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".output-area")))

    shadow_host = get_chrome_driver.find_element(By.CSS_SELECTOR, "marimo-anywidget")
    marimo_root = shadow_host.shadow_root
    widget = marimo_root.find_element(By.CLASS_NAME, "drag-words-widget")
    title = widget.find_element(By.CLASS_NAME, "title")
    assert title.get_attribute("innerText") == "Drag the words to the correct positions"
    

    