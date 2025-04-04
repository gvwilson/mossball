# institution_backend.py
from consts import PLUGIN_TYPES
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from dummy_data import sort_paragraphs_data, mc_data, str_data, drag_the_words_data, find_the_words_data, student_data

app = Flask(__name__)
CORS(app)


# --- Endpoints ---

# Helper functions to query a question for each plugin type

def query_stp(unique_id):
    data = sort_paragraphs_data.get(unique_id)
    if data:
        return jsonify({
            "unique_id": unique_id,
            "question": data["question"],
            "texts": data["texts"],
        })
    else:
        return jsonify({"error": "Data not found"}), 404


def query_mc(unique_id):
    data = mc_data.get(unique_id)
    if data:
        return jsonify({
            "unique_id": unique_id,
            "question": data["question"],
            "options": data["options"],
        })
    else:
        return jsonify({"error": "Data not found"}), 404


def query_str(unique_id):
    data = str_data.get(unique_id)
    if data:
        return jsonify({
            "unique_id": unique_id,
            "title": data["title"],
            "description": data["description"],
            "sections": data["sections"]
        })
    else:
        return jsonify({"error": "Data not found"}), 404


def query_drag(unique_id):
    data = drag_the_words_data.get(unique_id)
    if data:
        return jsonify({
            "unique_id": unique_id,
            "instruction": data["instruction"],
            "question": data["question"],
            "choices": data["choices"]
        })
    else:
        return jsonify({"error": "Data not found"}), 404
    
def query_ftw(unique_id):
    data = find_the_words_data.get(unique_id)
    if data:
        return jsonify({
            "unique_id": unique_id,
            "title": data["title"],
            "words": data["words"],
            "instructions": data["instructions"],
            "config": data["config"]
        })
    else:
        return jsonify({"error": "Data not found"}), 404


@app.route("/api/institution/plugin/query", methods=["GET"])
def institution_query():
    """
    Query endpoint.
    QueryParameters:

    - plugin_type (str): Type of plugin.
    - unique_id (str): Unique identifier.

    Returns:
    - JSON response containing plugin-specific data.
    """
    plugin_type = request.args.get("plugin_type")
    unique_id = request.args.get("unique_id")
    if plugin_type == PLUGIN_TYPES.SORT_PARAGRAPHS.value:
        return query_stp(unique_id)
    elif plugin_type == PLUGIN_TYPES.MULTIPLE_CHOICE.value:
        return query_mc(unique_id)
    elif plugin_type == PLUGIN_TYPES.STRUCTRUE_STRIP.value:
        return query_str(unique_id)
    elif plugin_type == PLUGIN_TYPES.DRAG_WORDS.value:
        return query_drag(unique_id)
    elif plugin_type == PLUGIN_TYPES.FIND_WORDS.value:
        return query_ftw(unique_id)
    return jsonify({"error": "Unsupported plugin type"}), 400


# Helper functions to verify a submission for each plugin type

def verify_stp(data, unique_id, student_id):
    user_answer = data.get("answer")
    stored = sort_paragraphs_data.get(unique_id)
    if not stored:
        return jsonify({"error": "Data not found"}), 404

    stored_texts = stored.get("texts")
    results = [answer == correct for
               answer, correct in zip(user_answer, stored_texts)]
    all_valid = all(results)

    current_time = datetime.now()
    timestamp = int(current_time.timestamp())
    user_data = student_data[student_id]
    user_data[unique_id] = (timestamp, all_valid)

    return jsonify({
        "unique_id": unique_id,
        "valid": all_valid,
        "results": results
    })


def verify_mc(data, unique_id, student_id):
    user_answer = data.get("answer")
    stored = mc_data.get(unique_id)
    if not stored:
        return jsonify({"error": "Data not found"}), 404

    stored_answer = stored.get("answer")
    results = 1 if user_answer == stored_answer else 0

    current_time = datetime.now()
    timestamp = int(current_time.timestamp())
    user_data = student_data[student_id]
    user_data[unique_id] = (timestamp, results)

    return jsonify({
        "unique_id": unique_id,
        "results": results
    })


def verify_drag(data, unique_id, student_id):
    user_answer = data.get("answer")
    stored = drag_the_words_data.get(unique_id)
    if not stored:
        return jsonify({"error": "Data not found"}), 404

    stored_answer = stored.get("choices")
    results = [
        answer == correct for answer, correct in zip(user_answer, stored_answer)
    ]

    current_time = datetime.now()
    timestamp = int(current_time.timestamp())
    user_data = student_data[student_id]
    user_data[unique_id] = (timestamp, results)

    return jsonify({
        "unique_id": unique_id,
        "results": results
    })

def verify_str(data, unique_id, student_id):
    user_answer = data.get("answer")
    stored = str_data.get(unique_id)
    if not stored:
        return jsonify({"error": "Data not found"}), 404

    current_time = datetime.now()
    timestamp = int(current_time.timestamp())
    user_data = student_data[student_id]
    user_data[unique_id] = (timestamp, user_answer)

    return jsonify({
        "unique_id": unique_id,
        "results": "Completed"
    })

@app.route("/api/institution/plugin/verify", methods=["POST"])
def institution_verify():
    """
    Verify endpoint.

    Parameters:
    - JSON containing plugin_type, unique_id, student_id, and plugin-specific answer data.
    
    Returns:
    - JSON response indicating verification status.
    """
    data = request.json
    plugin_type = data.get("plugin_type")
    unique_id = data.get("unique_id")
    student_id = data.get("student_id")

    if not student_id:
        return jsonify({"error": "Student not found"}), 404

    if plugin_type == PLUGIN_TYPES.SORT_PARAGRAPHS.value:
        return verify_stp(data, unique_id, student_id)
    elif plugin_type == PLUGIN_TYPES.MULTIPLE_CHOICE.value:
        return verify_mc(data, unique_id, student_id)
    elif plugin_type == PLUGIN_TYPES.DRAG_WORDS.value:
        return verify_drag(data, unique_id, student_id)
    elif plugin_type == PLUGIN_TYPES.STRUCTRUE_STRIP.value:
        return verify_str(data, unique_id, student_id)

    return jsonify({"error": "Unsupported plugin type"}), 400


@app.route("/api/institution/plugin/save", methods=["POST"])
def institution_save():
    """
    Save endpoint.

    Parameters:
    - JSON containing plugin_type, unique_id, and result details.

    Returns:
    - JSON response confirming data save.
    """
    data = request.json
    plugin_type = data.get("plugin_type")
    unique_id = data.get("unique_id")
    result = data.get("result")
    if plugin_type == PLUGIN_TYPES.SORT_PARAGRAPHS.value:
        stored = sort_paragraphs_data.get(unique_id)
        if not stored:
            return jsonify({"error": "Data not found"}), 404
        print(f"Saved result for {unique_id}: {result}")
        return jsonify({"status": "recorded", "unique_id": unique_id})
    return jsonify({"error": "Unsupported plugin type"}), 400


@app.route("/api/institution/plugin/student", methods=["POST"])
def institution_student():
    """
    Query endpoint for student login.
    
    Parameters:
    - JSON containing institution_id and student_id.
    
    Returns:
    - JSON response with student information or an error message.
    """
    data = request.json
    institution_id = data.get("institution_id")
    student_id = data.get("student_id")
    if student_id:
        return jsonify({
            "institution_id": institution_id,
            "student_id": student_id,
        })
    else:
        return jsonify({"error": "Student not found"}), 404


if __name__ == "__main__":
    app.run(debug=True, port=5002)
