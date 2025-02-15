# plugin_backend.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Temp storage for registered institutions
registered_institutions = {}

# --- Register ---


@app.route("/plugin/register", methods=["POST"])
def register_institution():
    """
    json format example:
      { "institution_id": "inst1", "backend_url": "http://localhost:5002/api" }
    """
    data = request.json
    institution_id = data.get("institution_id")
    backend_url = data.get("backend_url")
    if not institution_id or not backend_url:
        return jsonify({"error": "Missing institution_id or backend_url"}), 400

    registered_institutions[institution_id] = backend_url
    return jsonify({"message": "Institution registered successfully!", "institution_id": institution_id})


def get_institution_url(institution_id):
    return registered_institutions.get(institution_id)

# --- Endpoints ---


@app.route("/plugin/query/<institution_id>/<unique_id>", methods=["GET"])
def query_plugin(institution_id, unique_id):
    plugin_type = request.args.get("plugin_type")
    if not plugin_type:
        return jsonify({"error": "Missing plugin_type in query parameters"}), 400

    institution_url = get_institution_url(institution_id)
    if not institution_url:
        return jsonify({"error": "Institution not registered"}), 404

    # Call the institution's unified query endpoint.
    url = f"{institution_url}/api/institution/plugin/query"
    params = {"plugin_type": plugin_type, "unique_id": unique_id}
    try:
        resp = requests.get(url, params=params, timeout=5)
        resp.raise_for_status()
        return jsonify(resp.json())
    except requests.RequestException as e:
        return jsonify({"error": f"Request failed: {str(e)}"}), 500


@app.route("/plugin/verify/<institution_id>/<unique_id>", methods=["POST"])
def verify_plugin(institution_id, unique_id):
    data = request.json
    plugin_type = data.get("plugin_type")
    if not plugin_type:
        return jsonify({"error": "Missing plugin_type in JSON data"}), 400

    institution_url = get_institution_url(institution_id)
    if not institution_url:
        return jsonify({"error": "Institution not registered"}), 404

    url = f"{institution_url}/api/institution/plugin/verify"
    # Include plugin_type, unique_id, answer payload, etc.
    payload = {"plugin_type": plugin_type, "unique_id": unique_id, **data}
    try:
        resp = requests.post(url, json=payload, timeout=5)
        resp.raise_for_status()
        return jsonify(resp.json())
    except requests.RequestException as e:
        return jsonify({"error": f"Request failed: {str(e)}"}), 500


@app.route("/plugin/save/<institution_id>/<unique_id>", methods=["POST"])
def save_plugin(institution_id, unique_id):
    data = request.json
    plugin_type = data.get("plugin_type")
    if not plugin_type:
        return jsonify({"error": "Missing plugin_type in JSON data"}), 400

    institution_url = get_institution_url(institution_id)
    if not institution_url:
        return jsonify({"error": "Institution not registered"}), 404

    url = f"{institution_url}/api/institution/plugin/save"
    payload = {"plugin_type": plugin_type, "unique_id": unique_id, **data}
    try:
        resp = requests.post(url, json=payload, timeout=5)
        resp.raise_for_status()
        return jsonify(resp.json())
    except requests.RequestException as e:
        return jsonify({"error": f"Request failed: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5001)
