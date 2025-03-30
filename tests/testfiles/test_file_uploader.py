import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import tempfile
import os


@pytest.mark.parametrize("start_marimo", ["tests/notebooks/file_uploader_test.py"], indirect=True)
def test_file_uploader(get_chrome_driver, start_marimo):
    chrome_driver = get_chrome_driver

    # run the following notebook (marimo run tests/notebooks/find_the_words_untimed.py)
    url, process = start_marimo
    url = url.encode('ascii', 'ignore').decode('unicode_escape').strip()
    time.sleep(2)

    chrome_driver.get(url)
    chrome_driver.maximize_window()

    # get notebook title
    title = chrome_driver.title
    assert title == "file uploader test"

    # wait for plugin to load
    output_area = WebDriverWait(chrome_driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".output-area"))
    )
    assert output_area.is_displayed()

    # Get shadow root
    shadow_host = get_chrome_driver.find_element(
        By.CSS_SELECTOR, "marimo-anywidget")
    marimo_root = shadow_host.shadow_root

    # Get the file uploader element
    file_uploader = WebDriverWait(marimo_root, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".upload-container"))
    )
    assert file_uploader.is_displayed()

    def test_create_bucket(file_uploader):
        # configure s3 bucket
        configure_button = file_uploader.find_element(
            By.CSS_SELECTOR, ".try-button")
        configure_button.click()

        # test create bucket
        create_bucket = file_uploader.find_element(
            By.CSS_SELECTOR, ".flip-to-create")
        create_bucket.click()

        input_bucket_name = file_uploader.find_element(
            By.CSS_SELECTOR, ".new-bucket-input")
        input_bucket_name.send_keys("test-bucket1")

        create_button = file_uploader.find_element(
            By.CSS_SELECTOR, ".create-bucket-btn")
        create_button.click()

        confirm_button = WebDriverWait(file_uploader, 10).until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, ".creation-confirm-yes"))
        )
        confirm_button.click()

        back_button = WebDriverWait(file_uploader, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, ".flip-to-select"))
        )
        back_button.click()

    def upload_file(file_uploader):
        # select bucket and upload file
        selector = file_uploader.find_element(
            By.CSS_SELECTOR, ".bucket-select")
        selector.click()

        bucket = selector.find_element(
            By.CSS_SELECTOR, "option[value='test-bucket1']")
        bucket.click()

        file_uploader.find_element(
            By.CSS_SELECTOR, ".s3-dialog-close").click()

        bucket_name = file_uploader.find_element(
            By.CSS_SELECTOR, ".instruction")
        assert bucket_name.get_attribute(
            "innerText") == "Selected Bucket: test-bucket1"

        file_input = file_uploader.find_element(
            By.CSS_SELECTOR, "input[type='file']")

        # upload a file
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(b"Test file content")
            temp_file_path = temp_file.name

        file_input.send_keys(os.path.abspath(temp_file_path))

        WebDriverWait(file_uploader, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, f".//span[contains(text(), {temp_file_path})]"))
        )

        os.unlink(temp_file_path)

    def delete_file(file_uploader):
        # delete file
        time.sleep(2)
        WebDriverWait(file_uploader, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, ".delete-btn"))
        ).click()

        # wait for alert
        WebDriverWait(chrome_driver, 10).until(
            EC.alert_is_present()
        )
        alert = chrome_driver.switch_to.alert
        alert.accept()

        assert not file_uploader.find_elements(
            By.CSS_SELECTOR, ".file-item")

    test_create_bucket(file_uploader)
    upload_file(file_uploader)
    delete_file(file_uploader)
