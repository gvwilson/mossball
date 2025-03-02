import anywidget
import traitlets
from sessions.session_manager import global_session


def login_institution(institution_id):
    login_url = "http://localhost:5001/plugin/login"
    response = global_session.post(
        login_url,
        json={"institution_id": institution_id}
    )
    if response.status_code == 200:
        print(f"Logged in as {institution_id}")
    else:
        print(f"Login failed: {response.text}")


def login_student(institution_id, student_id):
    login_url = "http://localhost:5001/plugin/student/login"
    response = global_session.post(
        login_url,
        json={"institution_id": institution_id, "student_id": student_id}
    )
    if response.status_code == 200:
        print(f"Logged in as {student_id}")
    else:
        print(f"Login failed: {response.text}")


class LoginWidget(anywidget.AnyWidget):
    institution_id = traitlets.Unicode("").tag(sync=True)
    login_status = traitlets.Unicode("Not logged in").tag(sync=True)

    def __init__(self):
        super().__init__()

    def login(self):
        '''
        Login using global_session
        '''
        if self.institution_id:
            login_institution(self.institution_id)
            self.login_status = f"Logged in as {self.institution_id}"
        else:
            self.login_status = "Missing institution_id"


class StudentLoginWidget(anywidget.AnyWidget):
    institution_id = traitlets.Unicode("").tag(sync=True)
    student_id = traitlets.Unicode("").tag(sync=True)
    login_status = traitlets.Unicode("Not logged in").tag(sync=True)

    def __init__(self):
        super().__init__()

    def login(self):
        '''
        Login using global_session
        '''
        if self.institution_id and self.student_id:
            login_student(self.institution_id, self.student_id)
            self.login_status = f"Logged in as {self.student_id}"
        elif self.institution_id:
            self.login_status = "Missing student ID"
        elif self.student_id:
            self.login_status = "Missing institution ID"
        else:
            self.login_status = "Missing institution and student ID"

