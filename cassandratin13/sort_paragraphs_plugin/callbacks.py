import requests

def get_question():
    institution_id = "inst001"
    unique_id = 1
    plugin_type = "sort_paragraphs"
    url = f"http://localhost:5001/plugin/query/{institution_id}/{unique_id}?plugin_type={plugin_type}"

    try:
        response = requests.get(url)
        response.raise_for_status()

        data = response.json()
        question = data.get("question", "Default Question")
        texts = data.get("texts", ["Text1", "Text2", "Text3", "Text4"])
        return question, texts
    
    except requests.RequestException as e:
        print("Error fetching question: ", str(e))
        return "Error fetching question", []


def check_answer(texts):
    return

def record_results(score, student_id):
    return