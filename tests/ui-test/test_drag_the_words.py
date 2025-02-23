import pytest
import subprocess
import time
import re
import signal
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
# from helpers.setup import get_chrome_driver

def get_chrome_driver():
    service = Service(ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # Headless mode for CI/CD
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    
    return webdriver.Chrome(service=service, options=options)

@pytest.fixture
def start_marimo(request):
    '''
    Start Marimo and capture the running localhost URL
    '''
    file_name = request.param
    process = subprocess.Popen(["marimo", "run", file_name], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    marimo_url = None
    while True:
        time.sleep(0.5)
        output = process.stdout.readline()
        if not output:
            break
        url_matched = re.search(r"URL:\s*(\S+)", output)
        
        if url_matched:
            marimo_url = url_matched.group(1)
            break
    
    if not marimo_url:
        process.terminate()
        raise RuntimeError("Failed to detect Marimo server URL")
    
    print(f"Returning marimo_url: {marimo_url}, process: {process}")
    yield marimo_url, process

    # Clean up the process after the test
    process.terminate()
    process.wait()
    print(f"Terminated process with PID: {process.pid}")

@pytest.mark.parametrize("start_marimo", ["eun-chae-s/drag-the-words/implementation/drag_the_words.py"], indirect=True)
def test_basic_navigation(start_marimo):
    chrome_driver = get_chrome_driver()

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
    