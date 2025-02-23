import pytest
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


def test_basic_navigation():
    chrome_driver = get_chrome_driver()

    chrome_driver.get("https://www.selenium.dev/selenium/web/web-form.html")
    chrome_driver.maximize_window()
    title = chrome_driver.title
    assert title == "Web form"

    chrome_driver.quit()