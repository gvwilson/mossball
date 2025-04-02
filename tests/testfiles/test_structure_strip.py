import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

@pytest.mark.parametrize("start_marimo", ["tests/notebooks/structure_strip_test.py"], indirect=True)
def test_structure_strip_elements(get_chrome_driver, start_marimo, mock_server):
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    driver = get_chrome_driver
    driver.get(url)
    driver.maximize_window()
    
    # wait for plugin to load
    output_areas = WebDriverWait(driver, 30).until(
        EC.visibility_of_all_elements_located((By.CSS_SELECTOR, ".output-area"))
    )
    assert all(area.is_displayed() for area in output_areas)
    
    # Get shadow root
    shadow_hosts = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, "marimo-anywidget"))
    )
    assert len(shadow_hosts) >= 1

    found = False
    # Loop through each shadow host to locate the Structure Strip widget.
    for host in shadow_hosts:
        root = host.shadow_root
        try:
            # wait for the structure strip element in the shadow DOM
            widget = WebDriverWait(root, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "structure-strip"))
            )
            if widget:
                found = True
                # Check for the title element
                title = widget.find_element(By.CLASS_NAME, "structure-title")
                assert title.is_displayed()

                # Check for the description element
                description = widget.find_element(By.CLASS_NAME, "structure-description")
                assert description.is_displayed()
                
                # Check that at least one section is rendered
                sections = widget.find_elements(By.CLASS_NAME, "structure-section")
                assert len(sections) > 0
                break
        except Exception:
            continue
    assert found

    process.terminate()
    process.wait()
    driver.quit()
