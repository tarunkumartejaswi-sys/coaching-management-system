/* =========================================================
   COACHING MANAGEMENT SYSTEM
   TEST + RESULT MANAGEMENT
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const studentsKey = "cms_students";
const teachersKey = "cms_teachers";
const testsKey = "cms_tests";
const homeworkKey = "cms_homework";
const noticesKey = "cms_notices";
const attendanceKey = "cms_attendance";
const feesKey = "cms_fees";


/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultStudents = [
  {
    uid: "student_001",
    id: "S001",
    name: "Rahul Kumar",
    className: "Class 12",
    batch: "Class 12 A",
    phone: "9876543210",
    fees: 12000,
    paid: 10000
  },
  {
    uid: "student_002",
    id: "S002",
    name: "Priya Singh",
    className: "Class 12",
    batch: "Class 12 A",
    phone: "9876543211",
    fees: 12000,
    paid: 12000
  },
  {
    uid: "student_003",
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
    total: 100,
    questionPaper: "",
    solution: "",
    results: {}
  },
  {
    id: "TEST002",
    name: "Chemistry Test 1",
    subject: "Chemistry",
    date: "2026-09-12",
    total: 100,
    questionPaper: "",
    solution: "",
    results: {}
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
   HELPERS
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

  return "₹" +
    Number(value || 0)
      .toLocaleString("en-IN");

}


function today() {

  return new Date()
    .toISOString()
    .split("T")[0];

}


function getData(key, fallback) {

  const saved =
    localStorage.getItem(key);

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

  localStorage.setItem(
    key,
    JSON.stringify(data)
  );

}


function makeUID(prefix) {

  return prefix +
    "_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .substring(2, 8);

}


/* =========================================================
   STUDENT DATA
========================================================= */

function getStudents() {

  let students =
    getData(
      studentsKey,
      defaultStudents
    );


  let changed = false;


  students =
    students.map(student => {

      if (!student.uid) {

        student.uid =
          makeUID("student");

        changed = true;

      }


      if (!student.className) {

        student.className =
          student.batch || "";

        changed = true;

      }


      if (student.fees === undefined) {

        student.fees = 0;

        changed = true;

      }


      if (student.paid === undefined) {

        student.paid = 0;

        changed = true;

      }


      return student;

    });


  if (changed) {

    saveStudents(students);

  }


  return students;

}


function saveStudents(students) {

  saveData(
    studentsKey,
    students
  );

}


/* =========================================================
   TEACHER DATA
========================================================= */

function getTeachers() {

  return getData(
    teachersKey,
    defaultTeachers
  );

}


function saveTeachers(teachers) {

  saveData(
    teachersKey,
    teachers
  );

}


/* =========================================================
   TEST DATA
========================================================= */

function getTests() {

  let tests =
    getData(
      testsKey,
      defaultTests
    );


  let changed = false;


  tests =
    tests.map(test => {

      if (!test.results) {

        test.results = {};

        changed = true;

      }


      if (!test.questionPaper) {

        test.questionPaper = "";

      }


      if (!test.solution) {

        test.solution = "";

      }


      return test;

    });


  if (changed) {

    saveTests(tests);

  }


  return tests;

}


function saveTests(tests) {

  saveData(
    testsKey,
    tests
  );

}


/* =========================================================
   OTHER DATA
========================================================= */

function getHomework() {

  return getData(
    homeworkKey,
    defaultHomework
  );

}


function saveHomework(homework) {

  saveData(
    homeworkKey,
    homework
  );

}


function getNotices() {

  return getData(
    noticesKey,
    defaultNotices
  );

}


function saveNotices(notices) {

  saveData(
    noticesKey,
    notices
  );

}


function getAttendance() {

  return getData(
    attendanceKey,
    []
  );

}


function saveAttendance(attendance) {

  saveData(
    attendanceKey,
    attendance
  );

}


function getFees() {

  return getData(
    feesKey,
    []
  );

}


function saveFees(fees) {

  saveData(
    feesKey,
    fees
  );

}


/* =========================================================
   LOGIN
========================================================= */

function loginPage() {

  document.getElementById("app").innerHTML = `

    <div class="login-page">

      <div class="login-card">

        <h1>
          🎓 Coaching Management
        </h1>

        <p class="muted">
          Login to your account
        </p>


        <form onsubmit="login(event)">

          <label>
            Role
          </label>


          <select id="loginRole">

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


          <label>
            Username
          </label>


          <input
            id="username"
            type="text"
            placeholder="Enter username"
            required
          />


          <label>
            Password
          </label>


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

          <p>
            <b>Demo Login</b>
          </p>

          <p>
            Admin: admin / 1234
          </p>

          <p>
            Teacher: teacher / 1234
          </p>

          <p>
            Student: student / 1234
          </p>

        </div>

      </div>

    </div>

  `;

}


function login(event) {

  event.preventDefault();


  const role =
    document.getElementById(
      "loginRole"
    ).value;


  const username =
    document.getElementById(
      "username"
    ).value.trim();


  const password =
    document.getElementById(
      "password"
    ).value.trim();


  const valid =

    (
      role === "admin" &&
      username === "admin" &&
      password === "1234"
    )

    ||

    (
      role === "teacher" &&
      username === "teacher" &&
      password === "1234"
    )

    ||

    (
      role === "student" &&
      username === "student" &&
      password === "1234"
    );


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
   MAIN APPLICATION
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


          <button
            onclick="testsPage()"
          >
            ${
              role === "student"
                ? "📊 Results"
                : "📝 Tests"
            }
          </button>


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


  const collected =
    students.reduce(
      (sum, student) =>
        sum + Number(student.paid || 0),
      0
    );


  const total =
    students.reduce(
      (sum, student) =>
        sum + Number(student.fees || 0),
      0
    );


  const pending =
    total - collected;


  document.getElementById("view").innerHTML = `

    <div class="topbar">

      <div>

        <h1>

          ${
            role === "admin"
              ? "Admin Dashboard"
              : role === "teacher"
                ? "Teacher Dashboard"
                : "Student Dashboard"
          }

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

          <p>
            Total Students
          </p>

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

          <p>
            Teachers
          </p>

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

          <p>
            Fees Collected
          </p>

          <h2>
            ${money(collected)}
          </h2>

        </div>

      </div>


      <div class="stat-card">

        <div class="stat-icon">
          ⏳
        </div>

        <div>

          <p>
            Pending Fees
          </p>

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

          <p>
            ✅ Student management active
          </p>

          <p>
            📝 Test & result management active
          </p>

          <p>
            📅 Attendance management active
          </p>

          <p>
            💰 Fee management active
          </p>

          <p>
            📚 Homework active
          </p>

          <p>
            📢 Notice board active
          </p>

        </div>

      </div>


    </div>

  `;

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

        <td
          colspan="9"
          style="text-align:center"
        >
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
            onclick="editStudent('${student.uid}')"
          >
            ✏️
          </button>


          <button
            class="action-btn"
            onclick="deleteStudent('${student.uid}')"
          >
            🗑️
          </button>

        </td>

      </tr>

    `).join("");

}


function addStudent() {

  const students =
    getStudents();


  const id =
    prompt(
      "Enter Student ID:",
      "S" +
      String(
        students.length + 1
      ).padStart(3, "0")
    );


  if (!id) return;


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

    uid:
      makeUID("student"),

    id:
      id.trim().toUpperCase(),

    name:
      name.trim(),

    className:
      className.trim(),

    batch:
      batch.trim(),

    phone:
      phone.trim(),

    fees:
      fees,

    paid:
      paid

  });


  saveStudents(students);

  renderStudents();


  alert(
    "Student added successfully! ✅"
  );

}


function editStudent(uid) {

  const students =
    getStudents();


  const student =
    students.find(
      item =>
        item.uid === uid
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


function deleteStudent(uid) {

  const students =
    getStudents();


  const student =
    students.find(
      item =>
        item.uid === uid
    );


  if (!student) return;


  if (
    !confirm(
      `Delete ${student.name}?`
    )
  ) return;


  saveStudents(
    students.filter(
      item =>
        item.uid !== uid
    )
  );


  renderStudents();


  alert(
    "Student deleted successfully."
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
            onclick="editTeacher('${teacher.id}')"
          >
            ✏️
          </button>


          <button
            class="action-btn"
            onclick="deleteTeacher('${teacher.id}')"
          >
            🗑️
          </button>

        </td>

      </tr>

    `).join("");

}


function addTeacher() {

  const teachers =
    getTeachers();


  const id =
    prompt(
      "Enter Teacher ID:",
      "T" +
      String(
        teachers.length + 1
      ).padStart(3, "0")
    );


  if (!id) return;


  const cleanId =
    id.trim().toUpperCase();


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
      item =>
        item.id === id
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
      item =>
        item.id === id
    );


  if (!teacher) return;


  if (
    !confirm(
      `Delete ${teacher.name}?`
    )
  ) return;


  saveTeachers(
    teachers.filter(
      item =>
        item.id !== id
    )
  );


  renderTeachers();


  alert(
    "Teacher deleted successfully."
  );

}


/* =========================================================
   TEST MANAGEMENT
========================================================= */

function testsPage() {

  const role =
    localStorage.getItem(
      "cms_role"
    );


  document.getElementById("view").innerHTML = `

    <div class="topbar">

      <div>

        <h1>
          ${role === "student"
            ? "Results"
            : "Tests & Results"}
        </h1>

        <p class="muted">
          Manage tests, marks, attendance and rankings
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


    <div class="card">

      <h2>
        📊 Test Overview
      </h2>

      <p class="muted">
        Select a test below to view students, marks,
        attendance, percentages and rankings.
      </p>

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
            <th>Question Paper</th>
            <th>Solution</th>
            <th>Actions</th>

          </tr>

        </thead>


        <tbody id="testTable"></tbody>

      </table>

    </div>


    <div id="testDetails"></div>

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
    localStorage.getItem(
      "cms_role"
    );


  const tests =
    getTests();


  if (tests.length === 0) {

    table.innerHTML = `

      <tr>

        <td
          colspan="8"
          style="text-align:center"
        >
          No tests found.
        </td>

      </tr>

    `;

    return;

  }


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
          ${Number(test.total || 0)}
        </td>


        <td>

          ${
            test.questionPaper
              ? `
                <a
                  href="${escapeHTML(test.questionPaper)}"
                  target="_blank"
                  rel="noopener"
                >
                  📄 Open
                </a>
              `
              : `
                <span class="muted">
                  Not added
                </span>
              `
          }

        </td>


        <td>

          ${
            test.solution
              ? `
                <a
                  href="${escapeHTML(test.solution)}"
                  target="_blank"
                  rel="noopener"
                >
                  ✅ Open
                </a>
              `
              : `
                <span class="muted">
                  Not added
                </span>
              `
          }

        </td>


        <td>

          <button
            class="action-btn"
            onclick="viewTest('${test.id}')"
            title="View Students"
          >
            👁️
          </button>


          ${
            role !== "student"
              ? `

                <button
                  class="action-btn"
                  onclick="editTest('${test.id}')"
                  title="Edit Test"
                >
                  ✏️
                </button>


                <button
                  class="action-btn"
                  onclick="deleteTest('${test.id}')"
                  title="Delete Test"
                >
                  🗑️
                </button>

              `
              : ""
          }

        </td>

      </tr>

    `).join("");

}


/* =========================================================
   CREATE TEST
========================================================= */

function addTest() {

  const tests =
    getTests();


  const id =
    prompt(
      "Enter Test ID:",
      "TEST" +
      String(
        tests.length + 1
      ).padStart(3, "0")
    );


  if (!id) return;


  const cleanId =
    id.trim().toUpperCase();


  if (
    tests.some(
      test =>
        test.id.toUpperCase() ===
        cleanId
    )
  ) {

    alert(
      "Test ID already exists."
    );

    return;

  }


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


  if (
    isNaN(total) ||
    total <= 0
  ) {

    alert(
      "Enter valid total marks."
    );

    return;

  }


  const questionPaper =
    prompt(
      "Paste Question Paper URL (optional):",
      ""
    );


  const solution =
    prompt(
      "Paste Solution URL (optional):",
      ""
    );


  tests.push({

    id:
      cleanId,

    name:
      name.trim(),

    subject:
      subject.trim(),

    date:
      date.trim(),

    total:
      total,

    questionPaper:
      questionPaper
        ? questionPaper.trim()
        : "",

    solution:
      solution
        ? solution.trim()
        : "",

    results:
      {}

  });


  saveTests(tests);


  testsPage();


  alert(
    "Test created successfully! ✅"
  );

}


/* =========================================================
   EDIT TEST
========================================================= */

function editTest(id) {

  const tests =
    getTests();


  const test =
    tests.find(
      item =>
        item.id === id
    );


  if (!test) return;


  const name =
    prompt(
      "Test Name:",
      test.name
    );


  if (!name) return;


  const subject =
    prompt(
      "Subject:",
      test.subject
    );


  if (!subject) return;


  const date =
    prompt(
      "Test Date:",
      test.date
    );


  if (!date) return;


  const total =
    Number(
      prompt(
        "Total Marks:",
        test.total
      )
    );


  if (
    isNaN(total) ||
    total <= 0
  ) {

    alert(
      "Enter valid total marks."
    );

    return;

  }


  const questionPaper =
    prompt(
      "Question Paper URL:",
      test.questionPaper || ""
    );


  const solution =
    prompt(
      "Solution URL:",
      test.solution || ""
    );


  test.name =
    name.trim();


  test.subject =
    subject.trim();


  test.date =
    date.trim();


  test.total =
    total;


  test.questionPaper =
    questionPaper
      ? questionPaper.trim()
      : "";


  test.solution =
    solution
      ? solution.trim()
      : "";


  saveTests(tests);


  testsPage();


  alert(
    "Test updated successfully! ✅"
  );

}


/* =========================================================
   DELETE TEST
========================================================= */

function deleteTest(id) {

  const tests =
    getTests();


  const test =
    tests.find(
      item =>
        item.id === id
    );


  if (!test) return;


  if (
    !confirm(
      `Delete "${test.name}"?`
    )
  ) return;


  saveTests(
    tests.filter(
      item =>
        item.id !== id
    )
  );


  testsPage();


  alert(
    "Test deleted successfully."
  );

}


/* =========================================================
   VIEW TEST STUDENTS
========================================================= */

function viewTest(id) {

  const tests =
    getTests();


  const test =
    tests.find(
      item =>
        item.id === id
    );


  if (!test) return;


  if (!test.results) {

    test.results = {};

  }


  const students =
    getStudents();


  const details =
    document.getElementById(
      "testDetails"
    );


  if (!details) return;


  details.innerHTML = `

    <div class="card">

      <div class="topbar">

        <div>

          <h1>
            ${escapeHTML(test.name)}
          </h1>

          <p class="muted">

            ${escapeHTML(test.subject)}
            |
            ${escapeHTML(test.date)}
            |
            Total:
            ${test.total}

          </p>

        </div>


        <button
          class="primary"
          onclick="saveTestResults('${test.id}')"
          style="width:auto;margin-top:0"
        >
          💾 Save Results
        </button>

      </div>


      <div class="card">

        <h2>
          📄 Study Material
        </h2>


        <div class="form-grid">

          <div>

            <p>
              <b>
                Question Paper
              </b>
            </p>

            ${
              test.questionPaper
                ? `
                  <a
                    href="${escapeHTML(test.questionPaper)}"
                    target="_blank"
                    rel="noopener"
                  >
                    📄 Open Question Paper
                  </a>
                `
                : `
                  <span class="muted">
                    No question paper added
                  </span>
                `
            }

          </div>


          <div>

            <p>
              <b>
                Solution
              </b>
            </p>

            ${
              test.solution
                ? `
                  <a
                    href="${escapeHTML(test.solution)}"
                    target="_blank"
                    rel="noopener"
                  >
                    ✅ Open Solution
                  </a>
                `
                : `
                  <span class="muted">
                    No solution added
                  </span>
                `
            }

          </div>

        </div>

      </div>


      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>Rank</th>
              <th>Student ID</th>
              <th>Student</th>
              <th>Class</th>
              <th>Batch</th>
              <th>Attendance</th>
              <th>Marks</th>
              <th>Percentage</th>
              <th>Average %</th>

            </tr>

          </thead>


          <tbody id="testStudentTable"></tbody>

        </table>

      </div>


      <div
        id="testSummary"
        class="card"
      ></div>

    </div>

  `;


  renderTestStudents(test);

}


/* =========================================================
   RENDER STUDENTS FOR TEST
========================================================= */

function renderTestStudents(test) {

  const table =
    document.getElementById(
      "testStudentTable"
    );


  const summary =
    document.getElementById(
      "testSummary"
    );


  if (!table) return;


  const students =
    getStudents();


  const tests =
    getTests();


  /*
    Calculate average percentage
    for every student across all
    tests where marks were entered.
  */

  const studentStats =
    students.map(student => {

      let totalPercentage = 0;

      let testCount = 0;


      tests.forEach(item => {

        const result =
          item.results &&
          item.results[student.uid];


        if (
          result &&
          result.present === true &&
          result.marks !== "" &&
          result.marks !== null &&
          result.marks !== undefined
        ) {

          const percentage =
            (
              Number(result.marks) /
              Number(item.total || 1)
            ) * 100;


          totalPercentage +=
            percentage;


          testCount++;

        }

      });


      const average =
        testCount > 0
          ? totalPercentage / testCount
          : 0;


      return {

        student:
          student,

        average:
          average

      };

    });


  /*
    Ranking is based on average percentage.
  */

  studentStats.sort(
    (a, b) =>
      b.average - a.average
  );


  const rankMap = {};


  studentStats.forEach(
    (item, index) => {

      rankMap[
        item.student.uid
      ] = index + 1;

    }
  );


  /*
    Current test rows
  */

  table.innerHTML =
    students.map(student => {

      const result =
        test.results &&
        test.results[student.uid]
          ? test.results[student.uid]
          : {
              marks: "",
              present: true
            };


      const marks =
        result.marks === undefined
          ? ""
          : result.marks;


      const percentage =
        marks !== "" &&
        Number(test.total) > 0
          ? (
              Number(marks) /
              Number(test.total)
            ) * 100
          : 0;


      const stats =
        studentStats.find(
          item =>
            item.student.uid ===
            student.uid
        );


      const average =
        stats
          ? stats.average
          : 0;


      return `

        <tr>

          <td>
            <b>
              #${rankMap[student.uid]}
            </b>
          </td>


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

            <select
              id="present_${student.uid}"
            >

              <option
                value="present"
                ${
                  result.present !== false
                    ? "selected"
                    : ""
                }
              >
                🟢 Present
              </option>


              <option
                value="absent"
                ${
                  result.present === false
                    ? "selected"
                    : ""
                }
              >
                🔴 Absent
              </option>

            </select>

          </td>


          <td>

            <input
              type="number"
              id="marks_${student.uid}"
              value="${escapeHTML(marks)}"
              min="0"
              max="${Number(test.total)}"
              placeholder="Marks"
              style="width:90px"
              ${
                result.present === false
                  ? "disabled"
                  : ""
              }
              oninput="updateCurrentPercentage('${student.uid}','${test.id}')"
            />

          </td>


          <td
            id="percentage_${student.uid}"
          >

            ${
              marks !== ""
                ? percentage.toFixed(2) + "%"
                : "-"
            }

          </td>


          <td>

            <b>
              ${average.toFixed(2)}%
            </b>

          </td>

        </tr>

      `;

    }).join("");


  /*
    Summary
  */

  const presentStudents =
    students.filter(student => {

      const result =
        test.results &&
        test.results[student.uid];


      return !result ||
        result.present !== false;

    });


  const marksEntered =
    students.filter(student => {

      const result =
        test.results &&
        test.results[student.uid];


      return result &&
        result.present !== false &&
        result.marks !== "" &&
        result.marks !== undefined;

    });


  let totalPercentage = 0;


  marksEntered.forEach(student => {

    const result =
      test.results[
        student.uid
      ];


    totalPercentage +=
      (
        Number(result.marks) /
        Number(test.total || 1)
      ) * 100;

  });


  const testAverage =
    marksEntered.length > 0
      ? totalPercentage /
        marksEntered.length
      : 0;


  if (summary) {

    summary.innerHTML = `

      <h2>
        📊 Test Summary
      </h2>


      <div class="stats-grid">


        <div class="stat-card">

          <div class="stat-icon">
            👨‍🎓
          </div>

          <div>

            <p>
              Total Students
            </p>

            <h2>
              ${students.length}
            </h2>

          </div>

        </div>


        <div class="stat-card">

          <div class="stat-icon">
            🟢
          </div>

          <div>

            <p>
              Present
            </p>

            <h2>
              ${presentStudents.length}
            </h2>

          </div>

        </div>


        <div class="stat-card">

          <div class="stat-icon">
            📝
          </div>

          <div>

            <p>
              Marks Entered
            </p>

            <h2>
              ${marksEntered.length}
            </h2>

          </div>

        </div>


        <div class="stat-card">

          <div class="stat-icon">
            📈
          </div>

          <div>

            <p>
              Test Average
            </p>

            <h2>
              ${testAverage.toFixed(2)}%
            </h2>

          </div>

        </div>


      </div>


      <p class="muted">

        🏆 Ranking is automatically calculated
        according to each student's average
        percentage across all tests.

      </p>

    `;

  }


  /*
    Add attendance change listeners.
  */

  students.forEach(student => {

    const attendanceSelect =
      document.getElementById(
        `present_${student.uid}`
      );


    if (attendanceSelect) {

      attendanceSelect.onchange =
        function() {

          const marksInput =
            document.getElementById(
              `marks_${student.uid}`
            );


          if (
            this.value === "absent"
          ) {

            marksInput.value = "";

            marksInput.disabled = true;


            document.getElementById(
              `percentage_${student.uid}`
            ).innerHTML = "-";

          } else {

            marksInput.disabled =
              false;

          }

        };

    }

  });

}


/* =========================================================
   UPDATE CURRENT PERCENTAGE
========================================================= */

function updateCurrentPercentage(
  studentUid,
  testId
) {

  const tests =
    getTests();


  const test =
    tests.find(
      item =>
        item.id === testId
    );


  if (!test) return;


  const input =
    document.getElementById(
      `marks_${studentUid}`
    );


  const output =
    document.getElementById(
      `percentage_${studentUid}`
    );


  if (!input || !output) return;


  const marks =
    Number(input.value);


  if (
    input.value === "" ||
    isNaN(marks)
  ) {

    output.innerHTML = "-";

    return;

  }


  if (
    marks < 0 ||
    marks > Number(test.total)
  ) {

    output.innerHTML =
      "Invalid";

    return;

  }


  const percentage =
    (
      marks /
      Number(test.total)
    ) * 100;


  output.innerHTML =
    percentage.toFixed(2) +
    "%";

}


/* =========================================================
   SAVE TEST RESULTS
========================================================= */

function saveTestResults(testId) {

  const tests =
    getTests();


  const test =
    tests.find(
      item =>
        item.id === testId
    );


  if (!test) return;


  const students =
    getStudents();


  if (!test.results) {

    test.results = {};

  }


  students.forEach(student => {

    const attendanceSelect =
      document.getElementById(
        `present_${student.uid}`
      );


    const marksInput =
      document.getElementById(
        `marks_${student.uid}`
      );


    if (
      !attendanceSelect ||
      !marksInput
    ) return;


    const present =
      attendanceSelect.value ===
      "present";


    const marks =
      marksInput.value;


    if (!present) {

      test.results[
        student.uid
      ] = {

        present:
          false,

        marks:
          ""

      };

      return;

    }


    if (marks === "") {

      test.results[
        student.uid
      ] = {

        present:
          true,

        marks:
          ""

      };

      return;

    }


    const numericMarks =
      Number(marks);


    if (
      isNaN(numericMarks) ||
      numericMarks < 0 ||
      numericMarks > Number(test.total)
    ) {

      alert(
        `Invalid marks for ${student.name}.`
      );

      return;

    }


    test.results[
      student.uid
    ] = {

      present:
        true,

      marks:
        numericMarks

    };

  });


  saveTests(tests);


  viewTest(testId);


  alert(
    "Test results saved successfully! ✅"
  );

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

            <option
              value="${escapeHTML(student.uid)}"
            >
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


  const studentUid =
    document.getElementById(
      "attendanceStudent"
    ).value;


  const status =
    document.getElementById(
      "attendanceStatus"
    ).value;


  if (!date || !studentUid) {

    alert(
      "Please fill all fields."
    );

    return;

  }


  const attendance =
    getAttendance();


  attendance.push({

    id:
      makeUID("attendance"),

    date:
      date,

    studentUid:
      studentUid,

    status:
      status

  });


  saveAttendance(
    attendance
  );


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


  const records =
    getAttendance();


  const students =
    getStudents();


  if (records.length === 0) {

    table.innerHTML = `

      <tr>

        <td
          colspan="4"
          style="text-align:center"
        >
          No attendance records yet.
        </td>

      </tr>

    `;

    return;

  }


  table.innerHTML =
    records.slice()
      .reverse()
      .map(record => {

        const student =
          students.find(
            item =>
              item.uid ===
              record.studentUid
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
                  : "Unknown"
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

  const records =
    getAttendance();


  saveAttendance(
    records.filter(
      item =>
        item.id !== id
    )
  );


  renderAttendance();

}


/* =========================================================
   FEES
========================================================= */

function feesPage() {

  const students =
    getStudents();


  const collected =
    students.reduce(
      (sum, student) =>
        sum + Number(student.paid || 0),
      0
    );


  const pending =
    students.reduce(
      (sum, student) =>
        sum +
        (
          Number(student.fees || 0) -
          Number(student.paid || 0)
        ),
      0
    );


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

          <p>
            Total Collected
          </p>

          <h2>
            ${money(collected)}
          </h2>

        </div>

      </div>


      <div class="stat-card">

        <div class="stat-icon">
          ⏳
        </div>

        <div>

          <p>
            Total Pending
          </p>

          <h2>
            ${money(pending)}
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

            <option
              value="${escapeHTML(student.uid)}"
            >
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

  const studentUid =
    document.getElementById(
      "feeStudent"
    ).value;


  const amount =
    Number(
      document.getElementById(
        "feeAmount"
      ).value
    );


  if (
    !amount ||
    amount <= 0
  ) {

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
        item.uid === studentUid
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
      makeUID("fee"),

    studentUid:
      studentUid,

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
          Manage homework assignments
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


    <div id="homeworkList"></div>

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


  if (homework.length === 0) {

    container.innerHTML = `

      <div class="card">

        <p>
          No homework available.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML =
    homework.map(item => `

      <div class="card notice-card">

        <h2>
          📚 ${escapeHTML(item.title)}
        </h2>

        <p>
          <b>Subject:</b>
          ${escapeHTML(item.subject)}
        </p>

        <p>
          <b>Due Date:</b>
          ${escapeHTML(item.due)}
        </p>


        ${
          localStorage.getItem("cms_role") !== "student"
            ? `
              <button
                class="action-btn"
                onclick="deleteHomework('${item.id}')"
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
      makeUID("homework"),

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


  saveHomework(
    homework.filter(
      item =>
        item.id !== id
    )
  );


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


    <div id="noticeList"></div>

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


  if (notices.length === 0) {

    container.innerHTML = `

      <div class="card">

        <p>
          No notices available.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML =
    notices.slice()
      .reverse()
      .map(notice => `

        <div class="card notice-card">

          <h2>
            📢 ${escapeHTML(notice.title)}
          </h2>

          <p>
            ${escapeHTML(notice.message)}
          </p>

          <p class="muted">
            ${escapeHTML(notice.date)}
          </p>


          ${
            localStorage.getItem("cms_role") === "admin"
              ? `
                <button
                  class="action-btn"
                  onclick="deleteNotice('${notice.id}')"
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
      makeUID("notice"),

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


  saveNotices(
    notices.filter(
      notice =>
        notice.id !== id
    )
  );


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
