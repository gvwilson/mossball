import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.actions.mouse_button import MouseButton
from selenium.webdriver.common.actions.action_builder import ActionBuilder
from selenium.webdriver import ActionChains
import time

@pytest.mark.parametrize("start_marimo", ["tests/notebooks/sort_the_paragraph.py"], indirect=True)
def test_basic_structure(get_chrome_driver, start_marimo, mock_server):
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    get_chrome_driver.get(url)

    WebDriverWait(get_chrome_driver, 30).until(EC.presence_of_element_located((By.TAG_NAME, "marimo-anywidget")))
    shadow_hosts = get_chrome_driver.find_elements(By.CSS_SELECTOR, "marimo-anywidget")
    assert len(shadow_hosts) == 2

    tooltip_text = ["Drag the sequence items on the right into their correct positions.", "Alternatively, click the dropdown button to the right to select a sequence item to place in the current position."]

    for shadow_host in shadow_hosts:
        marimo_root = shadow_host.shadow_root
        widget = marimo_root.find_element(By.CLASS_NAME, "stp")
        title = widget.find_element(By.CLASS_NAME, "title")
        assert title.is_displayed()

        info = widget.find_element(By.CLASS_NAME, "info")
        assert info.is_displayed()

        info_tooltip = info.find_element(By.CLASS_NAME, "info-tooltip")
        assert info_tooltip.is_displayed()

        ActionChains(get_chrome_driver).move_to_element(info_tooltip).perform()

        info_tooltip_box = info.find_element(By.CLASS_NAME, "tippy-content")
        assert info_tooltip_box.is_displayed()
        assert all(text in info_tooltip_box.get_attribute("innerHTML") for text in tooltip_text)

        form = widget.find_element(By.CLASS_NAME, "main-container")
        assert form.is_displayed()

        paragraphs = form.find_element(By.CLASS_NAME, "texts-container").find_elements(By.CLASS_NAME, "container")
        assert len(paragraphs) > 0

        check_button = form.find_element(By.CLASS_NAME, "check-button")
        try_button = widget.find_element(By.CLASS_NAME, "try-button")

        assert check_button.is_displayed() and not try_button.is_displayed()
    
    process.terminate()
    process.wait()
    get_chrome_driver.quit()