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


@pytest.mark.parametrize("start_marimo", ["tests/notebooks/sort_the_paragraph.py"], indirect=True)
def test_drag_paragraphs(get_chrome_driver, start_marimo, mock_server):
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    get_chrome_driver.get(url)

    WebDriverWait(get_chrome_driver, 30).until(EC.presence_of_element_located((By.TAG_NAME, "marimo-anywidget")))
    shadow_hosts = get_chrome_driver.find_elements(By.CSS_SELECTOR, "marimo-anywidget")
    assert len(shadow_hosts) == 2

    for shadow_host in shadow_hosts:
        marimo_root = shadow_host.shadow_root
        widget = marimo_root.find_element(By.CLASS_NAME, "stp")

        form = widget.find_element(By.CLASS_NAME, "main-container")
        assert form.is_displayed()

        paragraphs = form.find_element(By.CLASS_NAME, "texts-container").find_elements(By.CLASS_NAME, "container")
        n_paragraphs = len(paragraphs)
        assert n_paragraphs > 0

        paragraphs_text = [para.get_attribute("data-text") for para in paragraphs]
        print(paragraphs_text)

        first_paragraph = paragraphs[0]
        next_paragraph = paragraphs[n_paragraphs - 1]

        # drag down
        ActionChains(get_chrome_driver).drag_and_drop(first_paragraph, next_paragraph).perform() # drop position = start of the next paragraph

        new_paragraphs = form.find_element(By.CLASS_NAME, "texts-container").find_elements(By.CLASS_NAME, "container")
        new_paragraphs_text = [para.get_attribute("data-text") for para in new_paragraphs]

        print(new_paragraphs_text)
        
        expected_paragraphs_text = paragraphs_text[1:n_paragraphs - 1] + [paragraphs_text[0], paragraphs_text[-1]]
        assert expected_paragraphs_text == new_paragraphs_text

        # drag up
        ActionChains(get_chrome_driver).drag_and_drop(new_paragraphs[n_paragraphs - 1], new_paragraphs[1]).perform() # drop position = start of the next paragraph

        expected_paragraphs_text = [new_paragraphs_text[0], new_paragraphs_text[n_paragraphs - 1]] + new_paragraphs_text[1:n_paragraphs - 1]

        new_paragraphs = form.find_element(By.CLASS_NAME, "texts-container").find_elements(By.CLASS_NAME, "container")
        new_paragraphs_text = [para.get_attribute("data-text") for para in new_paragraphs]
        print(new_paragraphs_text, expected_paragraphs_text)

        assert expected_paragraphs_text == new_paragraphs_text
    
    process.terminate()
    process.wait()
    get_chrome_driver.quit()

@pytest.mark.parametrize("start_marimo", ["tests/notebooks/sort_the_paragraph.py"], indirect=True)
def test_dropdown_arrows(get_chrome_driver, start_marimo, mock_server):
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    get_chrome_driver.get(url)

    WebDriverWait(get_chrome_driver, 30).until(EC.presence_of_element_located((By.TAG_NAME, "marimo-anywidget")))
    shadow_hosts = get_chrome_driver.find_elements(By.CSS_SELECTOR, "marimo-anywidget")
    assert len(shadow_hosts) == 2

    for shadow_host in shadow_hosts:
        marimo_root = shadow_host.shadow_root
        widget = marimo_root.find_element(By.CLASS_NAME, "stp")

        form = widget.find_element(By.CLASS_NAME, "main-container")
        assert form.is_displayed()

        paragraphs = form.find_element(By.CLASS_NAME, "texts-container").find_elements(By.CLASS_NAME, "container")
        n_paragraphs = len(paragraphs)
        assert n_paragraphs > 0

        initial_paragraphs_text = [para.get_attribute("data-text") for para in paragraphs] # text1, text2, text3, text4
        print(initial_paragraphs_text)

        first_paragraph = paragraphs[0]

        # click dropdown arrow
        first_paragraph.find_element(By.CLASS_NAME, "arrow-button").click()
        option_list = first_paragraph.find_element(By.CLASS_NAME, "option-list")
        assert option_list.is_displayed()

        # move up
        option_list.find_elements(By.CLASS_NAME, "option")[2].click() # click text3 to move it to the 1st place
        
        new_paragraphs = form.find_element(By.CLASS_NAME, "texts-container").find_elements(By.CLASS_NAME, "container")
        new_paragraphs_text = [para.get_attribute("data-text") for para in new_paragraphs]

        expected_paragraphs_text = [initial_paragraphs_text[2]] + [initial_paragraphs_text[0], initial_paragraphs_text[1]] + initial_paragraphs_text[3:]
        print(new_paragraphs_text, expected_paragraphs_text)
        
        assert expected_paragraphs_text == new_paragraphs_text

        # move down
        last_paragraph = paragraphs[-1]

        # click dropdown arrow
        last_paragraph.find_element(By.CLASS_NAME, "arrow-button").click()
        option_list = last_paragraph.find_element(By.CLASS_NAME, "option-list")
        assert option_list.is_displayed()

        # move down
        option_list.find_elements(By.CLASS_NAME, "option")[0].click() # click text1 to move it to the last place (which is currently located in 2nd place)
        
        expected_paragraphs_text = [new_paragraphs_text[0]] + new_paragraphs_text[2:] + [new_paragraphs_text[1]]
        
        new_paragraphs = form.find_element(By.CLASS_NAME, "texts-container").find_elements(By.CLASS_NAME, "container")
        new_paragraphs_text = [para.get_attribute("data-text") for para in new_paragraphs]
        print(new_paragraphs_text, expected_paragraphs_text)
        
        assert expected_paragraphs_text == new_paragraphs_text
    
    process.terminate()
    process.wait()
    get_chrome_driver.quit()