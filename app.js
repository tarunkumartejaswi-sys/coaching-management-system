/* =========================================================
   COACHING MANAGEMENT SYSTEM
   Complete Frontend Application
========================================================= */

const studentsKey = "cms_students";
const teachersKey = "cms_teachers";
const testsKey = "cms_tests";
const homeworkKey = "cms_homework";
const noticesKey = "cms_notices";
const attendanceKey = "cms_attendance";
const feesKey = "cms_fees";

const defaultStudents = [
  {
    id: "S001",
    name: "Rahul Kumar",
    className: "Class 12",
    batch: "Class 12 A",
    phone: "9876543210",
    fees: 12000,
    paid: 10000
  },
  {
    id: "S002",
    name: "Priya Singh",
    className: "Class 12",
    batch: "Class 12 A",
    phone: "9876543211",
    fees: 12000,
    paid: 12000
  },
  {
    id: "S003",
    name: "Aman Sharma",
    className: "Class 11",
    batch: "Class 11 B",
    phone: "9876543212",
    fees: 10000,
    paid: 7000
  }
];

const defaultTeachers = [
  {
    id: "T001",
    name: "Rajesh Kumar",
    subject: "Physics",
    batch: "Class 12 A"
  },
  {
    id: "T002",
    name: "Neha Singh",
    subject: "Chemistry",
    batch: "Class 12 A"
  },
  {
    id: "T003",
    name: "Amit Sharma",
    subject: "Mathematics",
    batch: "Class 12 B"
  }
];

const defaultTests = [
  {
    id: "TEST001",
    name: "Physics Test 1",
    subject: "Physics",
    date: "2026-09-10",
    total: 100
  },
  {
    id: "TEST002",
    name: "Chemistry Test 1",
    subject: "Chemistry",
    date: "2026-09-12",
    total: 100
  }
];

const defaultHomework = [
  {
    id: "HW001",
    subject: "Physics",
    title: "Numericals on Current Electricity",
    due: "2026-09-15"
  },
  {
    id: "HW002",
    subject: "Mathematics",
    title: "Integration Exercise",
    due: "2026-09-16"
  }
];

const defaultNotices = [
  {
    id: "N001",
    title: "Monthly Test",
    message: "Monthly tests will start from next week.",
    date: "2026-09-10"
  },
  {
    id: "N002",
    title: "Fee Reminder",
    message: "Students are requested to clear pending fees.",
    date: "2026-09-10"
  }
];


/* =========================================================
   BASIC HELPERS
========================================================= */

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function money(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN");
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function getData(key, fallback) {
  const saved = localStorage.getItem(key);

  if (!saved) {
    return fallback;
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.log(error);
    return fallback;
  }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}


/* =========================================================
   DATA FUNCTIONS
========================================================= */

function getStudents() {
  return getData(studentsKey, defaultStudents);
}

function saveStudents(students) {
  saveData(studentsKey, students);
}

function getTeachers() {
  return getData(teachersKey, defaultTeachers);
}

function saveTeachers(teachers) {
  saveData(teachersKey, teachers);
}

function getTests() {
  return getData(testsKey, defaultTests);
}

function saveTests(tests) {
  saveData(testsKey, tests);
}

function getHomework() {
  return getData(homeworkKey, defaultHomework);
}

function saveHomework(homework) {
  saveData(homeworkKey, homework);
}

function getNotices() {
  return getData(noticesKey, defaultNotices);
}

function saveNotices(notices) {
  saveData(noticesKey, notices);
}

function getAttendance() {
  return getData(attendanceKey, []);
}

function saveAttendance(attendance) {
  saveData(attendanceKey, attendance);
}

function getFees() {
  return getData(feesKey, []);
}

function saveFees(fees) {
  saveData(feesKey, fees);
}


/* =========================================================
   LOGIN
========================================================= */

function loginPage() {

  document.getElementById("app").innerHTML = `

    <div class="login-page">

      <div class="login-card">

        <h1>🎓 Coaching Management</h1>

        <p class="muted">
          Login to your account
        </p>

        <form onsubmit="login(event)">

          <label>Role</label>

          <select id="loginRole" required>

            <option value="admin">
              Admin
            </option>

            <option value="teacher">
              Teacher
            </option>

            <option value="student">
              Student
            </option>

          </select>


          <label>Username</label>

          <input
            id="username"
            type="text"
            placeholder="Enter username"
            required
          />


          <label>Password</label>

          <input
            id="password"
            type="password"
            placeholder="Enter password"
            required
          />


          <button
            type="submit"
            class="primary"
          >
            🔐 Login
          </button>

        </form>

        <div class="login-info">

          <p><b>Demo Login</b></p>

          <p>Admin: admin / 1234</p>
          <p>Teacher: teacher / 1234</p>
          <p>Student: student / 1234</p>

        </div>

      </div>

    </div>
  `;
}


function login(event) {

  event.preventDefault();

  const role =
    document.getElementById("loginRole").value;

  const username =
    document.getElementById("username").value.trim();

  const password =
    document.getElementById("password").value.trim();


  const valid =
    (role === "admin" &&
      username === "admin" &&
      password === "1234") ||

    (role === "teacher" &&
      username === "teacher" &&
      password === "1234") ||

    (role === "student" &&
      username === "student" &&
      password === "1234");


  if (!valid) {

    alert(
      "Invalid username or password."
    );

    return;
  }


  localStorage.setItem(
    "cms_role",
    role
  );


  app(role);
}


/* =========================================================
   MAIN APP
========================================================= */

function app(role) {

  document.getElementById("app").innerHTML = `

    <div class="app-layout">

      <aside class="sidebar">

        <div class="brand">

          🎓

          <span>
            Coaching<br>
            Management
          </span>

        </div>


        <nav>

          <button
            onclick="dashboard('${role}')"
          >
            🏠 Dashboard
          </button>


          <button
            onclick="studentsPage()"
          >
            👨‍🎓 Students
          </button>


          ${
            role === "admin"
              ? `
                <button
                  onclick="teachersPage()"
                >
                  👨‍🏫 Teachers
                </button>
              `
              : ""
          }


          ${
            role !== "student"
              ? `
                <button
                  onclick="testsPage()"
                >
                  📝 Tests
                </button>
              `
              : `
                <button
                  onclick="testsPage()"
                >
                  📊 Results
                </button>
              `
          }


          <button
            onclick="attendancePage()"
          >
            📅 Attendance
          </button>


          ${
            role === "admin"
              ? `
                <button
                  onclick="feesPage()"
                >
                  💰 Fees
                </button>
              `
              : ""
          }


          <button
            onclick="homeworkPage()"
          >
            📚 Homework
          </button>


          <button
            onclick="noticesPage()"
          >
            📢 Notices
          </button>


          <button
            onclick="logout()"
          >
            🚪 Logout
          </button>

        </nav>

      </aside>


      <main class="main-content">

        <div id="view"></div>

      </main>

    </div>
  `;


  dashboard(role);
}


/* =========================================================
   DASHBOARD
========================================================= */

function dashboard(role) {

  const students =
    getStudents();

  const teachers =
    getTeachers();

  const fees =
    students.reduce(
      (sum, student) =>
        sum + Number(student.paid || 0),
      0
    );

  const totalFees =
    students.reduce(
      (sum, student) =>
        sum + Number(student.fees || 0),
      0
    );

  const pending =
    totalFees - fees;


  document.getElementById("view").innerHTML = `

    <div class="topbar">

      <div>

        <h1>
          ${role === "admin"
            ? "Admin Dashboard"
            : role === "teacher"
              ? "Teacher Dashboard"
              : "Student Dashboard"}
        </h1>

        <p class="muted">
          Welcome to Coaching Management System
        </p>

      </div>

      <div class="role-badge">
        ${role.toUpperCase()}
      </div>

    </div>


    <div class="stats-grid">

      <div class="stat-card">

        <div class="stat-icon">
          👨‍🎓
        </div>

        <div>

          <p>Total Students</p>

          <h2>
            ${students.length}
          </h2>

        </div>

      </div>


      <div class="stat-card">

        <div class="stat-icon">
          👨‍🏫
        </div>

        <div>

          <p>Teachers</p>

          <h2>
            ${teachers.length}
          </h2>

        </div>

      </div>


      <div class="stat-card">

        <div class="stat-icon">
          💰
        </div>

        <div>

          <p>Fees Collected</p>

          <h2>
            ${money(fees)}
          </h2>

        </div>

      </div>


      <div class="stat-card">

        <div class="stat-icon">
          ⏳
        </div>

        <div>

          <p>Pending Fees</p>

          <h2>
            ${money(pending)}
          </h2>

        </div>

      </div>

    </div>


    <div class="dashboard-grid">

      <div class="card">

        <h2>
          ⚡ Quick Actions
        </h2>

        <div class="quick-actions">

          <button
            onclick="studentsPage()"
          >
            👨‍🎓 Students
          </button>


          ${
            role === "admin"
              ? `
                <button
                  onclick="teachersPage()"
                >
                  👨‍🏫 Teachers
                </button>

                <button
                  onclick="feesPage()"
                >
                  💰 Fees
                </button>
              `
              : ""
          }


          <button
            onclick="testsPage()"
          >
            📝 Tests
          </button>


          <button
            onclick="attendancePage()"
          >
            📅 Attendance
          </button>


          <button
            onclick="homeworkPage()"
          >
            📚 Homework
          </button>


          <button
            onclick="noticesPage()"
          >
            📢 Notices
          </button>

        </div>

      </div>


      <div class="card">

        <h2>
          🕒 Recent Activity
        </h2>

        <div class="activity-list">

          <p>✅ Student records available</p>

          <p>📝 Tests section ready</p>

          <p>📅 Attendance system ready</p>

          <p>📚 Homework system ready</p>

          <p>📢 Notice board ready</p>

        </div>

      </div>

    </div>
  `;
}


/* =========================================================
   HOME
========================================================= */

function home() {

  const role =
    localStorage.getItem("cms_role") || "admin";

  dashboard(role);
}


/* =========================================================
   STUDENTS
========================================================= */

function studentsPage() {

  document.getElementById("view").innerHTML = `

    <div class="topbar">

      <div>

        <h1>
          Students
        </h1>

        <p class="muted">
          Manage student records
        </p>

      </div>


      <button
        class="primary"
        onclick="addStudent()"
        style="width:auto;margin-top:0"
      >
        ➕ Add Student
      </button>

    </div>


    <div class="table-wrap">

      <table>

        <thead>

          <tr>

            <th>ID</th>
            <th>Name</th>
            <th>Class</th>
            <th>Batch</th>
            <th>Phone</th>
            <th>Total Fees</th>
            <th>Paid</th>
            <th>Pending</th>
            <th>Actions</th>

          </tr>

        </thead>


        <tbody id="studentTable"></tbody>

      </table>

    </div>
  `;


  renderStudents();
}


function renderStudents() {

  const table =
    document.getElementById(
      "studentTable"
    );

  if (!table) return;


  const students =
    getStudents();


  if (students.length === 0) {

    table.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center">
          No students found.
        </td>
      </tr>
    `;

    return;
  }


  table.innerHTML =
    students.map(student => `

      <tr>

        <td>
          ${escapeHTML(student.id)}
        </td>

        <td>
          ${escapeHTML(student.name)}
        </td>

        <td>
          ${escapeHTML(student.className)}
        </td>

        <td>
          ${escapeHTML(student.batch)}
        </td>

        <td>
          ${escapeHTML(student.phone)}
        </td>

        <td>
          ${money(student.fees)}
        </td>

        <td>
          ${money(student.paid)}
        </td>

        <td>
          ${money(
            Number(student.fees || 0) -
            Number(student.paid || 0)
          )}
        </td>

        <td>

          <button
            class="action-btn"
            onclick="editStudent('${escapeHTML(student.id)}')"
          >
            ✏️
          </button>

          <button
            class="action-btn"
            onclick="deleteStudent('${escapeHTML(student.id)}')"
          >
            🗑️
          </button>

        </td>

      </tr>

    `).join("");
}


function addStudent() {

  const id =
    prompt(
      "Enter Student ID:",
      "S" +
      String(
        getStudents().length + 1
      ).padStart(3, "0")
    );

  if (!id) return;


  const cleanId =
    id.trim().toUpperCase();


  const students =
    getStudents();


  if (
    students.some(
      student =>
        student.id.toUpperCase() ===
        cleanId
    )
  ) {

    alert(
      "Student ID already exists."
    );

    return;
  }


  const name =
    prompt(
      "Enter Student Name:"
    );

  if (!name) return;


  const className =
    prompt(
      "Enter Class:",
      "Class 12"
    );

  if (!className) return;


  const batch =
    prompt(
      "Enter Batch:",
      "Class 12 A"
    );

  if (!batch) return;


  const phone =
    prompt(
      "Enter Phone Number:"
    );

  if (!phone) return;


  const fees =
    Number(
      prompt(
        "Enter Total Fees:",
        "12000"
      )
    );


  if (isNaN(fees)) return;


  const paid =
    Number(
      prompt(
        "Enter Paid Amount:",
        "0"
      )
    );


  if (isNaN(paid)) return;


  students.push({

    id: cleanId,

    name: name.trim(),

    className:
      className.trim(),

    batch:
      batch.trim(),

    phone:
      phone.trim(),

    fees: fees,

    paid: paid

  });


  saveStudents(students);

  renderStudents();

  alert(
    "Student added successfully! ✅"
  );
}


function editStudent(id) {

  const students =
    getStudents();


  const student =
    students.find(
      item => item.id === id
    );


  if (!student) return;


  const name =
    prompt(
      "Student Name:",
      student.name
    );

  if (!name) return;


  const className =
    prompt(
      "Class:",
      student.className
    );

  if (!className) return;


  const batch =
    prompt(
      "Batch:",
      student.batch
    );

  if (!batch) return;


  const phone =
    prompt(
      "Phone:",
      student.phone
    );

  if (!phone) return;


  const fees =
    Number(
      prompt(
        "Total Fees:",
        student.fees
      )
    );


  if (isNaN(fees)) return;


  const paid =
    Number(
      prompt(
        "Paid Amount:",
        student.paid
      )
    );


  if (isNaN(paid)) return;


  student.name =
    name.trim();

  student.className =
    className.trim();

  student.batch =
    batch.trim();

  student.phone =
    phone.trim();

  student.fees =
    fees;

  student.paid =
    paid;


  saveStudents(students);

  renderStudents();

  alert(
    "Student updated successfully! ✅"
  );
}


function deleteStudent(id) {

  const students =
    getStudents();


  const student =
    students.find(
      item => item.id === id
    );


  if (!student) return;


  const confirmed =
    confirm(
      `Delete ${student.name}?`
    );


  if (!confirmed) return;


  const updated =
    students.filter(
      item => item.id !== id
    );


  saveStudents(updated);

  renderStudents();

  alert(
    "Student deleted successfully. 🗑️"
  );
}


/* =========================================================
   TEACHERS
========================================================= */

function teachersPage() {

  document.getElementById("view").innerHTML = `

    <div class="topbar">

      <div>

        <h1>
          Teachers
        </h1>

        <p class="muted">
          Manage teaching staff
        </p>

      </div>


      <button
        class="primary"
        onclick="addTeacher()"
        style="width:auto;margin-top:0"
      >
        ➕ Add Teacher
      </button>

    </div>


    <div class="table-wrap">

      <table>

        <thead>

          <tr>

            <th>ID</th>
            <th>Name</th>
            <th>Subject</th>
            <th>Batch</th>
            <th>Actions</th>

          </tr>

        </thead>


        <tbody id="teacherTable"></tbody>

      </table>

    </div>
  `;


  renderTeachers();
}


function renderTeachers() {

  const table =
    document.getElementById(
      "teacherTable"
    );

  if (!table) return;


  const teachers =
    getTeachers();


  if (teachers.length === 0) {

    table.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center">
          No teachers found.
        </td>
      </tr>
    `;

    return;
  }


  table.innerHTML =
    teachers.map(teacher => `

      <tr>

        <td>
          ${escapeHTML(teacher.id)}
        </td>

        <td>
          ${escapeHTML(teacher.name)}
        </td>

        <td>
          ${escapeHTML(teacher.subject)}
        </td>

        <td>
          ${escapeHTML(teacher.batch)}
        </td>

        <td>

          <button
            class="action-btn"
            onclick="editTeacher('${escapeHTML(teacher.id)}')"
          >
            ✏️
          </button>

          <button
            class="action-btn"
            onclick="deleteTeacher('${escapeHTML(teacher.id)}')"
          >
            🗑️
          </button>

        </td>

      </tr>

    `).join("");
}


function addTeacher() {

  const id =
    prompt(
      "Enter Teacher ID:",
      "T" +
      String(
        getTeachers().length + 1
      ).padStart(3, "0")
    );

  if (!id) return;


  const cleanId =
    id.trim().toUpperCase();


  const teachers =
    getTeachers();


  if (
    teachers.some(
      teacher =>
        teacher.id.toUpperCase() ===
        cleanId
    )
  ) {

    alert(
      "Teacher ID already exists."
    );

    return;
  }


  const name =
    prompt(
      "Enter Teacher Name:"
    );

  if (!name) return;


  const subject =
    prompt(
      "Enter Subject:",
      "Physics"
    );

  if (!subject) return;


  const batch =
    prompt(
      "Enter Batch:",
      "Class 12 A"
    );

  if (!batch) return;


  teachers.push({

    id:
      cleanId,

    name:
      name.trim(),

    subject:
      subject.trim(),

    batch:
      batch.trim()

  });


  saveTeachers(teachers);

  renderTeachers();

  alert(
    "Teacher added successfully! ✅"
  );
}


function editTeacher(id) {

  const teachers =
    getTeachers();


  const teacher =
    teachers.find(
      item => item.id === id
    );


  if (!teacher) return;


  const name =
    prompt(
      "Teacher Name:",
      teacher.name
    );

  if (!name) return;


  const subject =
    prompt(
      "Subject:",
      teacher.subject
    );

  if (!subject) return;


  const batch =
    prompt(
      "Batch:",
      teacher.batch
    );

  if (!batch) return;


  teacher.name =
    name.trim();

  teacher.subject =
    subject.trim();

  teacher.batch =
    batch.trim();


  saveTeachers(teachers);

  renderTeachers();

  alert(
    "Teacher updated successfully! ✅"
  );
}


function deleteTeacher(id) {

  const teachers =
    getTeachers();


  const teacher =
    teachers.find(
      item => item.id === id
    );


  if (!teacher) return;


  const confirmed =
    confirm(
      `Delete ${teacher.name}?`
    );


  if (!confirmed) return;


  const updated =
    teachers.filter(
      item => item.id !== id
    );


  saveTeachers(updated);

  renderTeachers();

  alert(
    "Teacher deleted successfully. 🗑️"
  );
}


/* =========================================================
   TESTS / RESULTS
========================================================= */

function testsPage() {

  const role =
    localStorage.getItem("cms_role");


  document.getElementById("view").innerHTML = `

    <div class="topbar">

      <div>

        <h1>
          ${role === "student"
            ? "Results"
            : "Tests"}
        </h1>

        <p class="muted">
          ${role === "student"
            ? "View test results"
            : "Manage tests and examinations"}
        </p>

      </div>


      ${
        role !== "student"
          ? `
            <button
              class="primary"
              onclick="addTest()"
              style="width:auto;margin-top:0"
            >
              ➕ Create Test
            </button>
          `
          : ""
      }

    </div>


    <div class="table-wrap">

      <table>

        <thead>

          <tr>

            <th>ID</th>
            <th>Test</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Total Marks</th>

            ${
              role !== "student"
                ? "<th>Actions</th>"
                : "<th>Result</th>"
            }

          </tr>

        </thead>


        <tbody id="testTable"></tbody>

      </table>

    </div>
  `;


  renderTests();
}


function renderTests() {

  const table =
    document.getElementById(
      "testTable"
    );

  if (!table) return;


  const role =
    localStorage.getItem("cms_role");


  const tests =
    getTests();


  table.innerHTML =
    tests.map(test => `

      <tr>

        <td>
          ${escapeHTML(test.id)}
        </td>

        <td>
          ${escapeHTML(test.name)}
        </td>

        <td>
          ${escapeHTML(test.subject)}
        </td>

        <td>
          ${escapeHTML(test.date)}
        </td>

        <td>
          ${test.total}
        </td>

        ${
          role !== "student"
            ? `
              <td>

                <button
                  class="action-btn"
                  onclick="deleteTest('${escapeHTML(test.id)}')"
                >
                  🗑️
                </button>

              </td>
            `
            : `
              <td>
                <span class="muted">
                  Not published
                </span>
              </td>
            `
        }

      </tr>

    `).join("");
}


function addTest() {

  const id =
    prompt(
      "Enter Test ID:",
      "TEST" +
      String(
        getTests().length + 1
      ).padStart(3, "0")
    );

  if (!id) return;


  const name =
    prompt(
      "Enter Test Name:"
    );

  if (!name) return;


  const subject =
    prompt(
      "Enter Subject:",
      "Physics"
    );

  if (!subject) return;


  const date =
    prompt(
      "Enter Test Date:",
      today()
    );

  if (!date) return;


  const total =
    Number(
      prompt(
        "Enter Total Marks:",
        "100"
      )
    );


  if (isNaN(total)) return;


  const tests =
    getTests();


  tests.push({

    id:
      id.trim().toUpperCase(),

    name:
      name.trim(),

    subject:
      subject.trim(),

    date:
      date.trim(),

    total:
      total

  });


  saveTests(tests);

  renderTests();

  alert(
    "Test created successfully! ✅"
  );
}


function deleteTest(id) {

  const tests =
    getTests();


  const confirmed =
    confirm(
      "Delete this test?"
    );


  if (!confirmed) return;


  const updated =
    tests.filter(
      test => test.id !== id
    );


  saveTests(updated);

  renderTests();
}


/* =========================================================
   ATTENDANCE
========================================================= */

function attendancePage() {

  document.getElementById("view").innerHTML = `

    <div class="topbar">

      <div>

        <h1>
          Attendance
        </h1>

        <p class="muted">
          Manage student attendance
        </p>

      </div>

    </div>


    <div class="card">

      <h2>
        📅 Mark Attendance
      </h2>


      <div class="form-grid">

        <input
          type="date"
          id="attendanceDate"
          value="${today()}"
        />


        <select
          id="attendanceStudent"
        >

          ${getStudents().map(student => `

            <option value="${escapeHTML(student.id)}">

              ${escapeHTML(student.id)}
              -
              ${escapeHTML(student.name)}

            </option>

          `).join("")}

        </select>


        <select
          id="attendanceStatus"
        >

          <option value="Present">
            Present
          </option>

          <option value="Absent">
            Absent
          </option>

          <option value="Late">
            Late
          </option>

        </select>


        <button
          class="primary"
          onclick="markAttendance()"
        >
          Save Attendance
        </button>

      </div>

    </div>


    <div class="table-wrap">

      <table>

        <thead>

          <tr>

            <th>Date</th>
            <th>Student</th>
            <th>Status</th>
            <th>Action</th>

          </tr>

        </thead>


        <tbody id="attendanceTable"></tbody>

      </table>

    </div>
  `;


  renderAttendance();
}


function markAttendance() {

  const date =
    document.getElementById(
      "attendanceDate"
    ).value;


  const studentId =
    document.getElementById(
      "attendanceStudent"
    ).value;


  const status =
    document.getElementById(
      "attendanceStatus"
    ).value;


  if (!date || !studentId) {

    alert(
      "Please fill all fields."
    );

    return;
  }


  const attendance =
    getAttendance();


  attendance.push({

    id:
      Date.now().toString(),

    date:
      date,

    studentId:
      studentId,

    status:
      status

  });


  saveAttendance(attendance);

  renderAttendance();

  alert(
    "Attendance saved! ✅"
  );
}


function renderAttendance() {

  const table =
    document.getElementById(
      "attendanceTable"
    );

  if (!table) return;


  const attendance =
    getAttendance();


  const students =
    getStudents();


  if (attendance.length === 0) {

    table.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center">
          No attendance records yet.
        </td>
      </tr>
    `;

    return;
  }


  table.innerHTML =
    attendance.slice().reverse()
      .map(record => {

        const student =
          students.find(
            item =>
              item.id ===
              record.studentId
          );


        return `

          <tr>

            <td>
              ${escapeHTML(record.date)}
            </td>

            <td>
              ${
                student
                  ? escapeHTML(student.name)
                  : record.studentId
              }
            </td>

            <td>
              ${escapeHTML(record.status)}
            </td>

            <td>

              <button
                class="action-btn"
                onclick="deleteAttendance('${record.id}')"
              >
                🗑️
              </button>

            </td>

          </tr>

        `;

      }).join("");
}


function deleteAttendance(id) {

  const attendance =
    getAttendance();


  const updated =
    attendance.filter(
      item => item.id !== id
    );


  saveAttendance(updated);

  renderAttendance();
}


/* =========================================================
   FEES
========================================================= */

function feesPage() {

  const students =
    getStudents();


  document.getElementById("view").innerHTML = `

    <div class="topbar">

      <div>

        <h1>
          Fees
        </h1>

        <p class="muted">
          Track student fee payments
        </p>

      </div>

    </div>


    <div class="stats-grid">

      <div class="stat-card">

        <div class="stat-icon">
          💰
        </div>

        <div>

          <p>Total Collected</p>

          <h2>
            ${money(
              students.reduce(
                (sum, s) =>
                  sum + Number(s.paid || 0),
                0
              )
            )}
          </h2>

        </div>

      </div>


      <div class="stat-card">

        <div class="stat-icon">
          ⏳
        </div>

        <div>

          <p>Total Pending</p>

          <h2>
            ${money(
              students.reduce(
                (sum, s) =>
                  sum +
                  (
                    Number(s.fees || 0) -
                    Number(s.paid || 0)
                  ),
                0
              )
            )}
          </h2>

        </div>

      </div>

    </div>


    <div class="card">

      <h2>
        💳 Collect Fee
      </h2>


      <div class="form-grid">

        <select id="feeStudent">

          ${students.map(student => `

            <option value="${escapeHTML(student.id)}">

              ${escapeHTML(student.id)}
              -
              ${escapeHTML(student.name)}

            </option>

          `).join("")}

        </select>


        <input
          id="feeAmount"
          type="number"
          placeholder="Payment amount"
          min="1"
        />


        <button
          class="primary"
          onclick="collectFee()"
        >
          💵 Collect Fee
        </button>

      </div>

    </div>


    <div class="table-wrap">

      <table>

        <thead>

          <tr>

            <th>ID</th>
            <th>Student</th>
            <th>Total Fees</th>
            <th>Paid</th>
            <th>Pending</th>

          </tr>

        </thead>


        <tbody>

          ${students.map(student => `

            <tr>

              <td>
                ${escapeHTML(student.id)}
              </td>

              <td>
                ${escapeHTML(student.name)}
              </td>

              <td>
                ${money(student.fees)}
              </td>

              <td>
                ${money(student.paid)}
              </td>

              <td>
                ${money(
                  Number(student.fees || 0) -
                  Number(student.paid || 0)
                )}
              </td>

            </tr>

          `).join("")}

        </tbody>

      </table>

    </div>
  `;
}


function collectFee() {

  const studentId =
    document.getElementById(
      "feeStudent"
    ).value;


  const amount =
    Number(
      document.getElementById(
        "feeAmount"
      ).value
    );


  if (!amount || amount <= 0) {

    alert(
      "Enter a valid payment amount."
    );

    return;
  }


  const students =
    getStudents();


  const student =
    students.find(
      item =>
        item.id ===
        studentId
    );


  if (!student) return;


  const pending =
    Number(student.fees || 0) -
    Number(student.paid || 0);


  if (amount > pending) {

    alert(
      "Payment cannot be greater than pending fees."
    );

    return;
  }


  student.paid =
    Number(student.paid || 0) +
    amount;


  saveStudents(students);


  const fees =
    getFees();


  fees.push({

    id:
      Date.now().toString(),

    studentId:
      studentId,

    amount:
      amount,

    date:
      today()

  });


  saveFees(fees);


  feesPage();


  alert(
    "Payment recorded successfully! ✅"
  );
}


/* =========================================================
   HOMEWORK
========================================================= */

function homeworkPage() {

  const role =
    localStorage.getItem(
      "cms_role"
    );


  document.getElementById("view").innerHTML = `

    <div class="topbar">

      <div>

        <h1>
          Homework
        </h1>

        <p class="muted">
          ${role === "student"
            ? "View assigned homework"
            : "Manage homework assignments"}
        </p>

      </div>


      ${
        role !== "student"
          ? `
            <button
              class="primary"
              onclick="addHomework()"
              style="width:auto;margin-top:0"
            >
              ➕ Add Homework
            </button>
          `
          : ""
      }

    </div>


    <div class="card">

      <div
        id="homeworkList"
      ></div>

    </div>
  `;


  renderHomework();
}


function renderHomework() {

  const container =
    document.getElementById(
      "homeworkList"
    );

  if (!container) return;


  const homework =
    getHomework();


  const role =
    localStorage.getItem(
      "cms_role"
    );


  if (homework.length === 0) {

    container.innerHTML =
      "<p>No homework available.</p>";

    return;
  }


  container.innerHTML =
    homework.map(item => `

      <div class="notice-card">

        <h3>
          📚 ${escapeHTML(item.title)}
        </h3>

        <p>
          <b>Subject:</b>
          ${escapeHTML(item.subject)}
        </p>

        <p>
          <b>Due:</b>
          ${escapeHTML(item.due)}
        </p>


        ${
          role !== "student"
            ? `
              <button
                class="action-btn"
                onclick="deleteHomework('${escapeHTML(item.id)}')"
              >
                🗑️ Delete
              </button>
            `
            : ""
        }

      </div>

    `).join("");
}


function addHomework() {

  const subject =
    prompt(
      "Enter Subject:",
      "Physics"
    );

  if (!subject) return;


  const title =
    prompt(
      "Enter Homework Title:"
    );

  if (!title) return;


  const due =
    prompt(
      "Enter Due Date:",
      today()
    );

  if (!due) return;


  const homework =
    getHomework();


  homework.push({

    id:
      "HW" +
      Date.now(),

    subject:
      subject.trim(),

    title:
      title.trim(),

    due:
      due.trim()

  });


  saveHomework(homework);

  renderHomework();

  alert(
    "Homework added successfully! ✅"
  );
}


function deleteHomework(id) {

  const homework =
    getHomework();


  if (
    !confirm(
      "Delete this homework?"
    )
  ) return;


  const updated =
    homework.filter(
      item => item.id !== id
    );


  saveHomework(updated);

  renderHomework();
}


/* =========================================================
   NOTICES
========================================================= */

function noticesPage() {

  const role =
    localStorage.getItem(
      "cms_role"
    );


  document.getElementById("view").innerHTML = `

    <div class="topbar">

      <div>

        <h1>
          Notices
        </h1>

        <p class="muted">
          Coaching centre notice board
        </p>

      </div>


      ${
        role === "admin"
          ? `
            <button
              class="primary"
              onclick="addNotice()"
              style="width:auto;margin-top:0"
            >
              ➕ Add Notice
            </button>
          `
          : ""
      }

    </div>


    <div
      id="noticeList"
    ></div>
  `;


  renderNotices();
}


function renderNotices() {

  const container =
    document.getElementById(
      "noticeList"
    );

  if (!container) return;


  const notices =
    getNotices();


  const role =
    localStorage.getItem(
      "cms_role"
    );


  if (notices.length === 0) {

    container.innerHTML = `
      <div class="card">
        <p>No notices available.</p>
      </div>
    `;

    return;
  }


  container.innerHTML =
    notices.slice().reverse()
      .map(notice => `

        <div class="card notice-card">

          <div class="notice-header">

            <h2>
              📢 ${escapeHTML(notice.title)}
            </h2>

            <span class="muted">
              ${escapeHTML(notice.date)}
            </span>

          </div>


          <p>
            ${escapeHTML(notice.message)}
          </p>


          ${
            role === "admin"
              ? `
                <button
                  class="action-btn"
                  onclick="deleteNotice('${escapeHTML(notice.id)}')"
                >
                  🗑️ Delete
                </button>
              `
              : ""
          }

        </div>

      `).join("");
}


function addNotice() {

  const title =
    prompt(
      "Enter Notice Title:"
    );

  if (!title) return;


  const message =
    prompt(
      "Enter Notice Message:"
    );

  if (!message) return;


  const notices =
    getNotices();


  notices.push({

    id:
      "N" +
      Date.now(),

    title:
      title.trim(),

    message:
      message.trim(),

    date:
      today()

  });


  saveNotices(notices);

  renderNotices();

  alert(
    "Notice added successfully! ✅"
  );
}


function deleteNotice(id) {

  const notices =
    getNotices();


  if (
    !confirm(
      "Delete this notice?"
    )
  ) return;


  const updated =
    notices.filter(
      notice =>
        notice.id !== id
    );


  saveNotices(updated);

  renderNotices();
}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

  localStorage.removeItem(
    "cms_role"
  );

  loginPage();
}


/* =========================================================
   START APPLICATION
========================================================= */

const savedRole =
  localStorage.getItem(
    "cms_role"
  );


if (savedRole) {

  app(savedRole);

} else {

  loginPage();

}
