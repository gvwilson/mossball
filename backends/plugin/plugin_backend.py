from flask import Flask, request, jsonify, session, render_template_string
from flask_cors import CORS
import requests
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
app.secret_key = "super_secret_key"
CORS(app, supports_credentials=True)


# MongoDB setup
client = MongoClient("mongodb://localhost:27017")
db = client.plugin_backend_db
institutions_collection = db.institutions

# Register


def register_institution_helper(institution_id, backend_url):
    if institutions_collection.find_one({"institution_id": institution_id}):
        return False, {"error": "Institution already registered"}

    now = datetime.now()
    institution_data = {
        "institution_id": institution_id,
        "backend_url": backend_url,
        "created_at": now,
        "modified_at": now,
    }

    result = institutions_collection.insert_one(institution_data)
    return True, {
        "message": "Institution registered successfully!",
        "institution_id": institution_id,
        "id": str(result.inserted_id)
    }


@app.route("/plugin/register", methods=["POST"])
def register_institution():
    """
    Expects JSON format:
      { "institution_id": "inst1", "backend_url": "http://localhost:5002/api" }
    """
    data = request.json
    institution_id = data.get("institution_id")
    backend_url = data.get("backend_url")
    if not institution_id or not backend_url:
        return jsonify({"error": "Missing institution_id or backend_url"}), 400

    success, resp = register_institution_helper(institution_id, backend_url)
    status = 200 if success else 400
    return jsonify(resp), status

# UI registration


@app.route("/ui/register", methods=["GET", "POST"])
def ui_register():
    if request.method == "POST":
        institution_id = request.form.get("institution_id")
        backend_url = request.form.get("backend_url")
        if not institution_id or not backend_url:
            return "Missing institution_id or backend_url", 400

        success, resp = register_institution_helper(
            institution_id, backend_url)
        if not success:
            return f"Error: {resp.get('error')}", 400
        return f"Institution <b>{institution_id}</b> registered successfully!"

    html_form = '''
    <h2>Register Institution</h2>
    <form method="post">
      Institution ID: <input type="text" name="institution_id"><br>
      Backend URL: <input type="text" name="backend_url"><br>
      <input type="submit" value="Register">
    </form>
    '''
    return render_template_string(html_form)


def get_institution_url(institution_id):
    institution = institutions_collection.find_one(
        {"institution_id": institution_id})
    return institution.get("backend_url") if institution else None

# Question endpoints


@app.route("/plugin/query/<unique_id>", methods=["GET"])
def query_plugin(unique_id):
    plugin_type = request.args.get("plugin_type")
    if not plugin_type:
        return jsonify({"error": "Missing plugin_type in query parameters"}), 400

    institution_id = session.get("institution_id")
    if not institution_id:
        return jsonify({"error": "You must log in to use this endpoint"}), 401

    institution_url = get_institution_url(institution_id)
    if not institution_url:
        return jsonify({"error": "Institution not registered"}), 404

    url = f"{institution_url}/api/institution/plugin/query"
    params = {"plugin_type": plugin_type, "unique_id": unique_id}
    try:
        resp = requests.get(url, params=params, timeout=5)
        resp.raise_for_status()
        return jsonify(resp.json())
    except requests.RequestException as e:
        return jsonify({"error": f"Request failed: {str(e)}"}), 500


@app.route("/plugin/verify/<unique_id>", methods=["POST"])
def verify_plugin(unique_id):
    data = request.json
    plugin_type = data.get("plugin_type")
    if not plugin_type:
        return jsonify({"error": "Missing plugin_type in JSON data"}), 400

    institution_id = session.get("institution_id")
    if not institution_id:
        return jsonify({"error": "You must log in to use this endpoint"}), 401

    institution_url = get_institution_url(institution_id)
    if not institution_url:
        return jsonify({"error": "Institution not registered"}), 404

    url = f"{institution_url}/api/institution/plugin/verify"
    payload = {"plugin_type": plugin_type, "unique_id": unique_id, **data}
    try:
        resp = requests.post(url, json=payload, timeout=5)
        resp.raise_for_status()
        return jsonify(resp.json())
    except requests.RequestException as e:
        return jsonify({"error": f"Request failed: {str(e)}"}), 500


@app.route("/plugin/save/<unique_id>", methods=["POST"])
def save_plugin(unique_id):
    data = request.json
    plugin_type = data.get("plugin_type")
    if not plugin_type:
        return jsonify({"error": "Missing plugin_type in JSON data"}), 400

    institution_id = session.get("institution_id")
    if not institution_id:
        return jsonify({"error": "You must log in to use this endpoint"}), 401

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


@app.route("/plugin/login", methods=["POST"])
def plugin_login():
    data = request.json
    institution_id = data.get("institution_id")
    if not institution_id:
        return "Missing institution_id", 400
    if not institutions_collection.find_one({"institution_id": institution_id}):
        return "Institution not registered", 404

    session["institution_id"] = institution_id
    return jsonify({"message": f"Logged in as {institution_id}"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5001)
