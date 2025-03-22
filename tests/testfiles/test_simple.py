def test_basic_navigation(get_chrome_driver):
    chrome_driver = get_chrome_driver

    chrome_driver.get("https://www.selenium.dev/selenium/web/web-form.html")
    chrome_driver.maximize_window()
    title = chrome_driver.title
    assert title == "Web form"

    chrome_driver.quit()