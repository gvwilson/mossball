# institution_backend.py
from consts import PLUGIN_TYPES
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Dummy data for the sort paragraphs plugin
sort_paragraphs_data = {
    "1": {
        "question": "Arrange the following steps of the water cycle:",
        "texts": [
            "Water evaporates from the surface.",
            "Water vapor condenses to form clouds.",
            "Precipitation occurs as rain or snow.",
            "Water collects in bodies of water."
        ],
    },
    "2": {
        "question": "Order the steps for problem solving:",
        "texts": [
            "Understand the problem",
            "Make a plan",
            "Carry out the plan",
            "Look back and reflect"
        ],
    }
}

student_data = {
    "1": {},
    "2": {},
    "3": {},
    "4": {},
    "5": {}
}

# --- Endpoints ---


@app.route("/api/institution/plugin/query", methods=["GET"])
def institution_query():
    """
    Query endpoint.
    Expects query parameters: plugin_type and unique_id.
    """
    plugin_type = request.args.get("plugin_type")
    unique_id = request.args.get("unique_id")
    if plugin_type == PLUGIN_TYPES.SORT_PARAGRAPHS.value:
        data = sort_paragraphs_data.get(unique_id)
        if data:
            return jsonify({
                "unique_id": unique_id,
                "question": data["question"],
                "texts": data["texts"],
            })
        else:
            return jsonify({"error": "Data not found"}), 404
    return jsonify({"error": "Unsupported plugin type"}), 400


@app.route("/api/institution/plugin/verify", methods=["POST"])
def institution_verify():
    """
    Verify endpoint.
    Expects JSON with: plugin_type, unique_id, student_id, and plugin-specific answer data.
    """
    data = request.json
    print(data)
    plugin_type = data.get("plugin_type")
    unique_id = data.get("unique_id")
    student_id = data.get("student_id")

    if not student_id:
        return jsonify({"error": "Student not found"}), 404

    if plugin_type == PLUGIN_TYPES.SORT_PARAGRAPHS.value:
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
        print(student_data)
        
        return jsonify({
            "unique_id": unique_id,
            "valid": all_valid,
            "results": results
        })
    return jsonify({"error": "Unsupported plugin type"}), 400


@app.route("/api/institution/plugin/save", methods=["POST"])
def institution_save():
    """
    Save endpoint.
    Expects JSON with: plugin_type, unique_id, and result details.
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
    Query endpoint.
    Expects query parameters: student_id.
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
