import pytest
from unittest import mock
from flask import session
from backends.plugin.plugin_backend import app, db
from tests.mock_inst import mock_query, MockResponse, get_id, get_data

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


@pytest.mark.order(1)
@pytest.mark.parametrize("data,expected_status", [
    ({"institution_id": "dummy_inst", "backend_url": "http://localhost:5002"}, 200), # sucessful register
    ({"backend_url": "http://localhost:5002"}, 400), # missing institution_id
    ({"institution_id": "dummy_inst"}, 400), # missing backend_url
    ({"institution_id": "dummy_inst2", "backend_url": "http://localhost:5002"}, 400), # institution_id already exists
])
def test_register_institution(client, data, expected_status):
    if expected_status == 200:   
        db.institutions.delete_one({"institution_id": data.get("institution_id")}) # ensure this institution is new
    elif expected_status == 400 and data.get("institution_id") and data.get("backend_url"):
        db.institutions.insert_one({"institution_id":  data.get("institution_id"), "backend_url":  data.get("backend_url")}) # ensure this already exists

    response = client.post("/plugin/register", json=data)
    assert response.status_code == expected_status
    if expected_status == 200: 
        assert "institution_id" in response.json
    
        # Check the values stored in the database
        inst = db.institutions.find_one({"institution_id": "dummy_inst"})
        assert inst is not None, "Institution not found in database"
        assert inst["institution_id"] == "dummy_inst", "Incorrect institution ID in database"
        assert inst["backend_url"] == "http://localhost:5002", "Incorrect backend URL in database"
    else:
        assert "error" in response.json


@pytest.mark.order(2)
@pytest.mark.parametrize("data,expected_status", [
    ({"institution_id": "dummy_inst"}, 200), # successful login
    ({}, 400), # missing institution_id
    ({"institution_id": "dummy_inst2"}, 404), # institution_id doesn't exist
])
def test_login_institution(client, data, expected_status):
    db.institutions.delete_one({"institution_id": "dummy_inst2"}) # ensure this institution doesn't exist
    response = client.post("/plugin/login", json=data)
    assert response.status_code == expected_status

    if expected_status == 200:
        assert "message" in response.json
    elif expected_status == 400:
        assert response.data == b'Missing institution_id'
    elif expected_status == 404:
        assert response.data == b'Institution not registered'


@pytest.mark.order(3)
@pytest.mark.parametrize("data, mock_response, expected_status, expected_content", [
    ( 
        {"institution_id": "dummy_inst", "student_id": "1"},
        {"institution_id": "dummy_inst", "student_id": "1"},
        200,
        {"institution_id": "dummy_inst", "student_id": "1"}
    ), # successful student login
    (
        {"student_id": "1"},
        None,
        400,
        "Missing institution_id"
    ), # missing institution_id
    (
        {"institution_id": "dummy_inst"},
        None,
        400,
        "Missing student_id"
    ), # missing student_id
    (
        {"institution_id": "unknown_inst", "student_id": "1"},
        None,
        404,
        "Institution not registered"
    ), # institution doesn't exist
])
def test_login_student(client, data, mock_response, expected_status, expected_content):
    with mock.patch("backends.plugin.plugin_backend.requests.post") as mock_post:
        if isinstance(mock_response, dict):
            mock_post.return_value = MockResponse(200, mock_response)
        elif isinstance(mock_response, Exception):
            mock_post.side_effect = mock_response

        response = client.post("/plugin/student/login", json=data)

        assert response.status_code == expected_status
        if expected_status == 200:
            assert response.get_json() == expected_content
            assert session["student_id"] == data["student_id"]
            assert session["institution_id"] == data["institution_id"]
        else:
            assert expected_content in response.get_json().values() if isinstance(expected_content, dict) else response.data.decode()


# Succesul queries will use the data from backends/institution/dummy_data.py
@pytest.mark.order(4)
@pytest.mark.parametrize("institution_id,plugin_type,unique_id,expected_status,expected_content", [
    ("dummy_inst", "sort_paragraphs", get_id("sort_paragraphs"), 200, get_data("sort_paragraphs")), # successful sort the paragraphs query
    ("dummy_inst", "multiple_choice", get_id("multiple_choice"), 200, get_data("multiple_choice")), # successful multiple choice query
    ("dummy_inst", "structure_strip", get_id("structure_strip"), 200, get_data("structure_strip")), # successful structure strip query
    ("dummy_inst", "drag_words", get_id("drag_words"), 200, get_data("drag_words")), # successful drag the words query
    ("dummy_inst", "find_words", get_id("find_words"), 200, get_data("find_words")), # successful find the words query
    (None, "sort_paragraphs", "2", 401, {}), # missing institution_id
    ("dummy_inst", None, "1", 400, {}), # missing plygin_type
    ("dummy_inst", "fill_in_blanks", "10", 500, {"error": "Unsupported plugin type"}), # incorrect plugin_type
])

def test_query_plugin(client, institution_id, plugin_type, unique_id, expected_status, expected_content):
    with client.session_transaction() as mock_session:
        if institution_id:
            mock_session["institution_id"] = institution_id
        else:
            mock_session["institution_id"] = None

    with mock.patch('backends.plugin.plugin_backend.requests.get', side_effect=mock_query):
        print("Plugin type: ", plugin_type)
        response = client.get(f"/plugin/query/{unique_id}", query_string={"plugin_type": plugin_type})
        print(response)
        assert response.status_code == expected_status 

        if response.status == 200:
            response_data = response.json()
            assert response_data == expected_content


@pytest.mark.order(5)
@pytest.mark.parametrize("session_data,request_data,mock_response,expected_status,expected_content", [
    (
        {"institution_id": "dummy_inst", "student_id": "1"},
        {"plugin_type": "sort_paragraphs", "unique_id": "1"},
        {"results": "correct"},
        200,
        {"results": "correct"}
    ), # successful verification
    (
        {"institution_id": "dummy_inst", "student_id": "1"},
        {}, 
        None,  
        400,
        {"error": "Missing plugin_type in JSON data"}
    ), # missing plugin_type
    (
        {"institution_id": "dummy_inst"},
        {"plugin_type": "sort_paragraphs", "unique_id": "1"}, 
        None,  
        400,
        {"error": "Missing student_id in JSON data"}
    ), # missing student_id
    (
        {"student_id": "1"},
        {"plugin_type": "sort_paragraphs", "unique_id": "1"},
        None,
        401,
        {"error": "You must be a student of this institution to use this endpoint"}
    ), # missing institution_id (not logged in)
    (
        {"institution_id": "unknown_inst", "student_id": "1"},
        {"plugin_type": "sort_paragraphs", "unique_id": "1"},
        None,
        404,
        {"error": "Institution not registered"}
    ) # institution_id doesn't exist
])
def test_verify_plugin(client, session_data, request_data, mock_response, expected_status, expected_content):
    with client.session_transaction() as session:
        for key, value in session_data.items():
            session[key] = value

    with mock.patch("backends.plugin.plugin_backend.requests.post") as mock_post:
        if isinstance(mock_response, dict):
            mock_post.return_value = MockResponse(200, mock_response)
        elif isinstance(mock_response, Exception):
            mock_post.side_effect = mock_response

        response = client.post(f"/plugin/verify/1", json=request_data)

        assert response.status_code == expected_status
        assert response.get_json() == expected_content


@pytest.mark.order(6)
@pytest.mark.parametrize("session_data,request_data,mock_response,expected_status,expected_content", [
    (
        {"institution_id": "dummy_inst"},
        {"plugin_type": "sort_paragraphs", "extra_data": "some_value"},
        {"success": True, "message": "Saved successfully!"},
        200,
        {"success": True, "message": "Saved successfully!"}
    ), # successful save
    (
        {"institution_id": "dummy_inst"},
        {"extra_data": "some_value"},
        None,
        400,
        {"error": "Missing plugin_type in JSON data"}
    ), # missing plugin_type
    (
        {},
        {"plugin_type": "sort_paragraphs"},
        None,
        401,
        {"error": "You must log in to use this endpoint"}
    ), # missing institution_id (not logged in)
    (
        {"institution_id": "unknown_inst"},
        {"plugin_type": "sort_paragraphs"},
        None,
        404,
        {"error": "Institution not registered"}
    ), # institution_id doesn't exist
])
def test_save_plugin(client, session_data, request_data, mock_response, expected_status, expected_content):
    with client.session_transaction() as session:
        for key, value in session_data.items():
            session[key] = value

    with mock.patch("backends.plugin.plugin_backend.requests.post") as mock_post:
        if isinstance(mock_response, dict):
            mock_post.return_value = MockResponse(200, mock_response)
        elif isinstance(mock_response, Exception):
            mock_post.side_effect = mock_response

        response = client.post("/plugin/save/1", json=request_data)

        assert response.status_code == expected_status
        assert response.get_json() == expected_content