import pytest
import time

@pytest.mark.parametrize("start_marimo", ["eun-chae-s/drag-the-words/implementation/drag_the_words.py"], indirect=True)
def test_basic_navigation(get_chrome_driver, start_marimo):
    chrome_driver = get_chrome_driver

    # run the following notebook (marimo run eun-chae-s/drag-the-words/implementation/drag_the_words.py)
    # achieve the url
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    time.sleep(2)

    chrome_driver.get(url)
    chrome_driver.maximize_window()
    
    # check that the question is visible
    title = chrome_driver.title
    assert title == "drag the words"

    process.terminate()
    process.wait()
    chrome_driver.quit()
    