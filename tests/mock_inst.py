import requests
from backends.institution.dummy_data import sort_paragraphs_data, mc_data, str_data, drag_the_words_data, find_the_words_data

class MockResponse:
    def __init__(self, status_code, json_data):
        self.status_code = status_code
        self._json_data = json_data
    
    def json(self):
        return self._json_data
    
    def raise_for_status(self):
        if self.status_code != 200:
            raise requests.exceptions.RequestException(f"Error {self.status_code}: {self._json_data.get('error', 'Unknown error')}")
        
def mock_query(url, params, timeout):
    if params["plugin_type"] == "sort_paragraphs":
        return MockResponse(200, sort_paragraphs_data[params["unique_id"]])
    elif params["plugin_type"] == "multiple_choice":
        return MockResponse(200, mc_data[params["unique_id"]])
    elif params["plugin_type"] == "drag_words":
        return MockResponse(200, drag_the_words_data[params["unique_id"]])
    elif params["plugin_type"] == "structure_strip":
        return MockResponse(200, str_data[params["unique_id"]])
    elif params["plugin_type"] == "find_words":
        return MockResponse(200, find_the_words_data[params["unique_id"]])
    else:
        return MockResponse(500, {"error": "Unsupported plugin type"})

def get_id(plugin_type):
    if plugin_type == "sort_paragraphs":
        return list(sort_paragraphs_data.keys())[0]
    elif plugin_type == "multiple_choice":
        return list(mc_data.keys())[0]
    elif plugin_type == "structure_strip":
        return list(str_data.keys())[0]
    elif plugin_type == "drag_words":
        return list(drag_the_words_data.keys())[0]
    elif plugin_type =="find_words":
        return list(find_the_words_data.keys())[0]
    
    
def get_data(plugin_type):
    if plugin_type == "sort_paragraphs":
        return list(sort_paragraphs_data.values())[0]
    elif plugin_type == "multiple_choice":
        return list(mc_data.values())[0]
    elif plugin_type == "structure_strip":
        return list(str_data.values())[0]
    elif plugin_type == "drag_words":
        return list(drag_the_words_data.values())[0]
    elif plugin_type =="find_words":
        return list(find_the_words_data.values())[0]