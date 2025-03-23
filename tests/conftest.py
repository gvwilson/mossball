import pytest
import subprocess
import time
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from flask import Flask, jsonify, request
from threading import Thread
import time

app = Flask(__name__)

@pytest.fixture(scope="module")
def get_chrome_driver():
    service = Service(ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")  # Headless mode for CI/CD
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    
    chrome_driver = webdriver.Chrome(service=service, options=options)
    yield chrome_driver

    chrome_driver.quit()


@pytest.fixture(scope="module")
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
    yield marimo_url

    # Clean up the process after the test
    process.terminate()
    process.wait()
    print(f"Terminated process with PID: {process.pid}")

# Mock backend
dummy_data = {
    "drag_words": {
        "content": {
            "instruction": "Drag the words to the correct positions",
            "question": (
                "In a multitasking operating system, {{}} share the CPU by using {{}} such as Round Robin and First Come, First Served. "
                "The OS also manages {{}}, ensuring that each process has access to the necessary {{}}, "
                "to prevent {{}}, it employs techniques like resource ordering and {{}}."
            ),
            "choices": [
                "processes", "scheduling algorithms", "memory allocation",
                "resources", "deadlocks", "preemption"
            ]
        },
        "success": {'results': [True, True, True, True, True, True], 'unique_id': '5'}
    }
}

@app.route("/plugin/query/<unique_id>", methods=["GET"])
def mock_get_plugin(unique_id):
    plugin_type = request.args.get("plugin_type")
    if plugin_type == "drag_words":
        return jsonify(dummy_data["drag_words"]["content"]), 200
    else:
        return jsonify({"error": "Not found"}), 404

@app.route("/plugin/verify/<unique_id>", methods=["POST"])
def mock_verify_plugin(unique_id):
    plugin_type = request.args.get("plugin_type")
    if plugin_type == "drag_words":
        return jsonify(dummy_data["drag_words"]["success"]), 200
    else:
        return jsonify({"error": "Request failed"}), 500
    
@pytest.fixture(scope="session", autouse=True)
def mock_server():
    def run():
        app.run(port=5001, debug=False, use_reloader=False)
    
    thread = Thread(target=run, daemon=True)
    thread.start()
    time.sleep(1)  # Give time for the server to start

    yield