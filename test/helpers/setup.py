from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager

def get_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # Headless mode for CI/CD
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    
    return webdriver.Chrome(ChromeDriverManager().install(), options=options)
