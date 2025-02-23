from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager

# TODO: make this file to be able to be imported
def get_chrome_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # Headless mode for CI/CD
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    
    return webdriver.Chrome(ChromeDriverManager().install(), options=options)
