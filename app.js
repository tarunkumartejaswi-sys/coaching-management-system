/* =========================================================
   COACHING MANAGEMENT SYSTEM
   STUDENT LOGIN + ROLE BASED DASHBOARDS
========================================================= */

const studentsKey = "cms_students";
const teachersKey = "cms_teachers";
const testsKey = "cms_tests";
const homeworkKey = "cms_homework";
const noticesKey = "cms_notices";
const attendanceKey = "cms_attendance";
const feesKey = "cms_fees";


/* =========================================================
   DEFAULT STUDENTS
========================================================= */

const defaultStudents = [
  {
    uid: "student_001",
    id: "S001",
    name: "Rahul Kumar",
    className: "Class 12",
    batch: "Class 12 A",
    phone: "9876543210",
    username: "rahul001",
    password: "1234",
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
    username: "priya002",
    password: "1234",
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
    username: "aman003",
    password: "1234",
    fees: 10000,
    paid: 7000
  }
];


/* =========================================================
   DEFAULT TEACHERS
========================================================= */

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


/* =========================================================
   DEFAULT TESTS
========================================================= */

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


/* =========================================================
   DEFAULT HOMEWORK
========================================================= */

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


/* =========================================================
   DEFAULT NOTICES
========================================================= */

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


function makeUID(prefix) {

  return prefix +
    "_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .substring(2, 8);

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


/* =========================================================
   STUDENTS DATA
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


      /*
         Give old students a username/password
         if they don't already have one.
      */

      if (!student.username) {

        student.username =
          (
            student.name
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "")
          ) +
          student.id
            .toLowerCase();

        changed = true;

      }


      if (!student.password) {

        student.password = "1234";

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
   TEACHERS DATA
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


      if (
        test.questionPaper ===
        undefined
      ) {

        test.questionPaper = "";

        changed = true;

      }


      if (
        test.solution ===
        undefined
      ) {

        test.solution = "";

        changed = true;

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


function saveHomework(data) {

  saveData(
    homeworkKey,
    data
  );

}


function getNotices() {

  return getData(
    noticesKey,
    defaultNotices
  );

}


function saveNotices(data) {

  saveData(
    noticesKey,
    data
  );

}


function getAttendance() {

  return getData(
    attendanceKey,
    []
  );

}


function saveAttendance(data) {

  saveData(
    attendanceKey,
    data
  );

}


function getFees() {

  return getData(
    feesKey,
    []
  );

}


function saveFees(data) {

  saveData(
    feesKey,
    data
  );

}


/* =========================================================
   LOGIN PAGE
========================================================= */

function loginPage() {

  document.getElementById(
    "app"
  ).innerHTML = `

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
            Login As
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
          >


          <label>
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Enter password"
            required
          >


          <button
            type="submit"
            class="primary"
          >
            🔐 Login
          </button>

        </form>


        <div class="login-info">

          <p>
            <b>Demo Accounts</b>
          </p>

          <p>
            Admin:
            admin / 1234
          </p>

          <p>
            Teacher:
            teacher / 1234
          </p>

          <p>
            Student Rahul:
            rahul001 / 1234
          </p>

          <p>
            Student Priya:
            priya002 / 1234
          </p>

          <p>
            Student Aman:
            aman003 / 1234
          </p>

        </div>

      </div>

    </div>

  `;

}


/* =========================================================
   LOGIN
========================================================= */

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


  /*
     ADMIN LOGIN
  */

  if (
    role === "admin" &&
    username === "admin" &&
    password === "1234"
  ) {

    localStorage.setItem(
      "cms_role",
      "admin"
    );

    localStorage.removeItem(
      "cms_student_uid"
    );

    app("admin");

    return;

  }


  /*
     TEACHER LOGIN
  */

  if (
    role === "teacher" &&
    username === "teacher" &&
    password === "1234"
  ) {

    localStorage.setItem(
      "cms_role",
      "teacher"
    );

    localStorage.removeItem(
      "cms_student_uid"
    );

    app("teacher");

    return;

  }


  /*
     STUDENT LOGIN
  */

  if (role === "student") {

    const students =
      getStudents();


    const student =
      students.find(
        item =>
          item.username === username &&
          item.password === password
      );


    if (student) {

      localStorage.setItem(
        "cms_role",
        "student"
      );


      localStorage.setItem(
        "cms_student_uid",
        student.uid
      );


      app("student");

      return;

    }

  }


  alert(
    "Invalid username or password."
  );

}


/* =========================================================
   MAIN APP
========================================================= */

function app(role) {

  document.getElementById(
    "app"
  ).innerHTML = `

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
            onclick="dashboard()"
          >
            🏠 Dashboard
          </button>


          ${
            role !== "student"
              ? `
                <button
                  onclick="studentsPage()"
                >
                  👨‍🎓 Students
                </button>
              `
              : ""
          }


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
                ? "📊 My Results"
                : "📝 Tests"
            }
          </button>


          <button
            onclick="attendancePage()"
          >
            📅 ${
              role === "student"
                ? "My Attendance"
                : "Attendance"
            }
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


  dashboard();

}


/* =========================================================
   GET CURRENT STUDENT
========================================================= */

function getCurrentStudent() {

  const uid =
    localStorage.getItem(
      "cms_student_uid"
    );

  if (!uid) {
    return null;
  }


  return getStudents().find(
    student =>
      student.uid === uid
  );

}


/* =========================================================
   STUDENT ATTENDANCE PERCENTAGE
========================================================= */

function getStudentAttendancePercentage(
  studentUid
) {

  const records =
    getAttendance().filter(
      record =>
        record.studentUid ===
        studentUid
    );


  if (records.length === 0) {
    return 0;
  }


  let present = 0;


  records.forEach(record => {

    if (
      record.status === "Present" ||
      record.status === "Late"
    ) {

      present++;

    }

  });


  return (
    present /
    records.length
  ) * 100;

}


/* =========================================================
   STUDENT AVERAGE
========================================================= */

function getStudentAverage(
  studentUid
) {

  const tests =
    getTests();


  let total = 0;
  let count = 0;


  tests.forEach(test => {

    const result =
      test.results &&
      test.results[studentUid];


    if (
      result &&
      result.present === true &&
      result.marks !== "" &&
      result.marks !== undefined
    ) {

      total +=
        Number(result.marks) /
        Number(test.total || 1) *
        100;

      count++;

    }

  });


  if (count === 0) {
    return 0;
  }


  return total / count;

}


/* =========================================================
   STUDENT RANK
========================================================= */

function getStudentRank(
  studentUid
) {

  const students =
    getStudents();


  const stats =
    students.map(student => {

      return {

        uid: student.uid,

        average:
          getStudentAverage(
            student.uid
          )

      };

    });


  stats.sort(
    (a, b) =>
      b.average -
      a.average
  );


  const index =
    stats.findIndex(
      item =>
        item.uid === studentUid
    );


  if (index === -1) {
    return "-";
  }


  return index + 1;

}


/* =========================================================
   DASHBOARD
========================================================= */

function dashboard() {

  const role =
    localStorage.getItem(
      "cms_role"
    );


  /*
     STUDENT DASHBOARD
  */

  if (role === "student") {

    studentDashboard();

    return;

  }


  /*
     ADMIN / TEACHER DASHBOARD
  */

  const students =
    getStudents();

  const teachers =
    getTeachers();


  const collected =
    students.reduce(
      (sum, student) =>
        sum +
        Number(
          student.paid || 0
        ),
      0
    );


  const total =
    students.reduce(
      (sum, student) =>
        sum +
        Number(
          student.fees || 0
        ),
      0
    );


  const pending =
    total -
    collected;


  document.getElementById(
    "view"
  ).innerHTML = `

    <div class="topbar">

      <div>

        <h1>
          ${
            role === "admin"
              ? "Admin Dashboard"
              : "Teacher Dashboard"
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


      ${
        role === "admin"
          ? `

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

          `
          : ""
      }

    </div>


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

  `;

}


/* =========================================================
   STUDENT DASHBOARD
========================================================= */

function studentDashboard() {

  const student =
    getCurrentStudent();


  if (!student) {

    logout();

    return;

  }


  const pending =
    Math.max(
      0,
      Number(student.fees || 0) -
      Number(student.paid || 0)
    );


  const attendance =
    getStudentAttendancePercentage(
      student.uid
    );


  const average =
    getStudentAverage(
      student.uid
    );


  const rank =
    getStudentRank(
      student.uid
    );


  const tests =
    getTests()
      .filter(
        test =>
          test.date >= today()
      )
      .sort(
        (a, b) =>
          a.date.localeCompare(
            b.date
          )
      );


  const allTests =
    getTests();


  const completedResults =
    allTests
      .filter(test => {

        const result =
          test.results &&
          test.results[student.uid];

        return (
          result &&
          result.present === true &&
          result.marks !== "" &&
          result.marks !== undefined
        );

      })
      .sort(
        (a, b) =>
          b.date.localeCompare(
            a.date
          )
      );


  const homework =
    getHomework();


  const notices =
    getNotices()
      .slice()
      .reverse();


  document.getElementById(
    "view"
  ).innerHTML = `

    <div class="topbar">

      <div>

        <h1>
          👋 Welcome, ${escapeHTML(student.name)}
        </h1>

        <p class="muted">
          Student Dashboard
        </p>

      </div>


      <div class="role-badge">
        STUDENT
      </div>

    </div>


    <div class="card">

      <h2>
        👤 My Profile
      </h2>

      <div class="form-grid">

        <div>
          <p class="muted">
            Student ID
          </p>

          <h3>
            ${escapeHTML(student.id)}
          </h3>
        </div>


        <div>
          <p class="muted">
            Class
          </p>

          <h3>
            ${escapeHTML(student.className)}
          </h3>
        </div>


        <div>
          <p class="muted">
            Batch
          </p>

          <h3>
            ${escapeHTML(student.batch)}
          </h3>
        </div>


        <div>
          <p class="muted">
            Username
          </p>

          <h3>
            ${escapeHTML(student.username)}
          </h3>
        </div>

      </div>

    </div>


    <div class="stats-grid">


      <div class="stat-card">

        <div class="stat-icon">
          💰
        </div>

        <div>

          <p>
            Pending Fee
          </p>

          <h2>
            ${money(pending)}
          </h2>

        </div>

      </div>


      <div class="stat-card">

        <div class="stat-icon">
          📅
        </div>

        <div>

          <p>
            Attendance
          </p>

          <h2>
            ${attendance.toFixed(1)}%
          </h2>

        </div>

      </div>


      <div class="stat-card">

        <div class="stat-icon">
          📈
        </div>

        <div>

          <p>
            Average
          </p>

          <h2>
            ${average.toFixed(1)}%
          </h2>

        </div>

      </div>


      <div class="stat-card">

        <div class="stat-icon">
          🏆
        </div>

        <div>

          <p>
            Current Rank
          </p>

          <h2>
            #${rank}
          </h2>

        </div>

      </div>


    </div>


    <div class="card">

      <h2>
        📝 Upcoming Tests
      </h2>


      ${
        tests.length === 0

          ? `

            <p class="muted">
              No upcoming tests.
            </p>

          `

          : `

            <div class="table-wrap">

              <table>

                <thead>

                  <tr>

                    <th>
                      Test
                    </th>

                    <th>
                      Subject
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Marks
                    </th>

                  </tr>

                </thead>


                <tbody>

                  ${tests.slice(0, 5).map(test => `

                    <tr>

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

                    </tr>

                  `).join("")}

                </tbody>

              </table>

            </div>

          `
      }

    </div>


    <div class="card">

      <h2>
        📊 Latest Result
      </h2>


      ${
        completedResults.length === 0

          ? `

            <p class="muted">
              No results published yet.
            </p>

          `

          : `

            <div class="table-wrap">

              <table>

                <thead>

                  <tr>

                    <th>
                      Test
                    </th>

                    <th>
                      Subject
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Marks
                    </th>

                    <th>
                      Percentage
                    </th>

                  </tr>

                </thead>


                <tbody>

                  ${completedResults.slice(0, 5).map(test => {

                    const result =
                      test.results[
                        student.uid
                      ];

                    const percentage =
                      Number(result.marks) /
                      Number(test.total || 1) *
                      100;


                    return `

                      <tr>

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
                          ${result.marks}
                          /
                          ${test.total}
                        </td>

                        <td>
                          <b>
                            ${percentage.toFixed(2)}%
                          </b>
                        </td>

                      </tr>

                    `;

                  }).join("")}

                </tbody>

              </table>

            </div>

          `
      }

    </div>


    <div class="card">

      <h2>
        📚 Homework
      </h2>


      ${
        homework.length === 0

          ? `

            <p class="muted">
              No homework available.
            </p>

          `

          : `

            ${homework.slice(0, 5).map(item => `

              <div class="card">

                <h3>
                  📚 ${escapeHTML(item.title)}
                </h3>

                <p>
                  <b>
                    Subject:
                  </b>

                  ${escapeHTML(item.subject)}
                </p>

                <p>
                  <b>
                    Due:
                  </b>

                  ${escapeHTML(item.due)}
                </p>

              </div>

            `).join("")}

          `
      }

    </div>


    <div class="card">

      <h2>
        📢 Latest Notices
      </h2>


      ${
        notices.length === 0

          ? `

            <p class="muted">
              No notices available.
            </p>

          `

          : `

            ${notices.slice(0, 5).map(notice => `

              <div class="card">

                <h3>
                  📢 ${escapeHTML(notice.title)}
                </h3>

                <p>
                  ${escapeHTML(notice.message)}
                </p>

                <p class="muted">
                  ${escapeHTML(notice.date)}
                </p>

              </div>

            `).join("")}

          `
      }

    </div>

  `;

}


/* =========================================================
   STUDENTS
========================================================= */

function studentsPage() {

  const role =
    localStorage.getItem(
      "cms_role"
    );


  if (role === "student") {

    studentDashboard();

    return;

  }


  document.getElementById(
    "view"
  ).innerHTML = `

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

            <th>
              ID
            </th>

            <th>
              Name
            </th>

            <th>
              Class
            </th>

            <th>
              Batch
            </th>

            <th>
              Phone
            </th>

            <th>
              Username
            </th>

            <th>
              Total Fees
            </th>

            <th>
              Paid
            </th>

            <th>
              Pending
            </th>

            <th>
              Actions
            </th>

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


  const role =
    localStorage.getItem(
      "cms_role"
    );


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
          <b>
            ${escapeHTML(student.username)}
          </b>
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
            title="Edit Student"
          >
            ✏️
          </button>


          ${
            role === "admin"
              ? `

                <button
                  class="action-btn"
                  onclick="deleteStudent('${student.uid}')"
                  title="Delete Student"
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
   ADD STUDENT
========================================================= */

function addStudent() {

  const role =
    localStorage.getItem(
      "cms_role"
    );


  if (
    role !== "admin" &&
    role !== "teacher"
  ) {

    alert(
      "You do not have permission."
    );

    return;

  }


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


  const cleanId =
    id.trim().toUpperCase();


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


  const username =
    prompt(
      "Create Student Username:"
    );


  if (!username) return;


  const cleanUsername =
    username
      .trim()
      .toLowerCase();


  if (
    students.some(
      student =>
        student.username &&
        student.username.toLowerCase() ===
        cleanUsername
    )
  ) {

    alert(
      "Username already exists. Please choose another."
    );

    return;

  }


  const password =
    prompt(
      "Create Student Password:"
    );


  if (!password) return;


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


  if (
    isNaN(fees) ||
    fees < 0
  ) {

    alert(
      "Enter valid fees."
    );

    return;

  }


  const paid =
    Number(
      prompt(
        "Enter Paid Amount:",
        "0"
      )
    );


  if (
    isNaN(paid) ||
    paid < 0 ||
    paid > fees
  ) {

    alert(
      "Enter valid paid amount."
    );

    return;

  }


  students.push({

    uid:
      makeUID("student"),

    id:
      cleanId,

    name:
      name.trim(),

    className:
      className.trim(),

    batch:
      batch.trim(),

    phone:
      phone.trim(),

    username:
      cleanUsername,

    password:
      password.trim(),

    fees:
      fees,

    paid:
      paid

  });


  saveStudents(
    students
  );


  renderStudents();


  alert(
    "Student added successfully! ✅\n\n" +
    "Username: " +
    cleanUsername +
    "\nPassword: " +
    password.trim()
  );

}


/* =========================================================
   EDIT STUDENT
========================================================= */

function editStudent(uid) {

  const role =
    localStorage.getItem(
      "cms_role"
    );


  if (
    role !== "admin" &&
    role !== "teacher"
  ) {

    alert(
      "You do not have permission."
    );

    return;

  }


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


  const username =
    prompt(
      "Student Username:",
      student.username
    );


  if (!username) return;


  const cleanUsername =
    username
      .trim()
      .toLowerCase();


  const duplicate =
    students.some(
      item =>
        item.uid !== uid &&
        item.username &&
        item.username.toLowerCase() ===
        cleanUsername
    );


  if (duplicate) {

    alert(
      "Username already exists."
    );

    return;

  }


  const changePassword =
    confirm(
      "Do you want to change the student's password?"
    );


  let password =
    student.password;


  if (changePassword) {

    const newPassword =
      prompt(
        "Enter New Password:"
      );


    if (!newPassword) return;


    password =
      newPassword.trim();

  }


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


  if (
    isNaN(fees) ||
    fees < 0
  ) return;


  const paid =
    Number(
      prompt(
        "Paid Amount:",
        student.paid
      )
    );


  if (
    isNaN(paid) ||
    paid < 0 ||
    paid > fees
  ) {

    alert(
      "Invalid paid amount."
    );

    return;

  }


  student.name =
    name.trim();


  student.username =
    cleanUsername;


  student.password =
    password;


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


  saveStudents(
    students
  );


  renderStudents();


  alert(
    "Student updated successfully! ✅"
  );

}


/* =========================================================
   DELETE STUDENT
========================================================= */

function deleteStudent(uid) {

  if (
    localStorage.getItem(
      "cms_role"
    ) !== "admin"
  ) {

    alert(
      "Only Admin can delete students."
    );

    return;

  }


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

  if (
    localStorage.getItem(
      "cms_role"
    ) !== "admin"
  ) {

    alert(
      "Only Admin can manage teachers."
    );

    return;

  }


  document.getElementById(
    "view"
  ).innerHTML = `

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

            <th>
              ID
            </th>

            <th>
              Name
            </th>

            <th>
              Subject
            </th>

            <th>
              Batch
            </th>

            <th>
              Actions
            </th>

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

  if (
    localStorage.getItem(
      "cms_role"
    ) !== "admin"
  ) {

    alert(
      "Only Admin can add teachers."
    );

    return;

  }


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


  saveTeachers(
    teachers
  );


  renderTeachers();


  alert(
    "Teacher added successfully! ✅"
  );

}


function editTeacher(id) {

  if (
    localStorage.getItem(
      "cms_role"
    ) !== "admin"
  ) {

    alert(
      "Only Admin can edit teachers."
    );

    return;

  }


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


  saveTeachers(
    teachers
  );


  renderTeachers();


  alert(
    "Teacher updated successfully! ✅"
  );

}


function deleteTeacher(id) {

  if (
    localStorage.getItem(
      "cms_role"
    ) !== "admin"
  ) {

    alert(
      "Only Admin can delete teachers."
    );

    return;

  }


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
   TESTS
========================================================= */

function testsPage() {

  const role =
    localStorage.getItem(
      "cms_role"
    );


  if (role === "student") {

    studentResultsPage();

    return;

  }


  document.getElementById(
    "view"
  ).innerHTML = `

    <div class="topbar">

      <div>

        <h1>
          Tests & Results
        </h1>

        <p class="muted">
          Manage tests and student results
        </p>

      </div>


      <button
        class="primary"
        onclick="addTest()"
        style="width:auto;margin-top:0"
      >
        ➕ Create Test
      </button>

    </div>


    <div class="table-wrap">

      <table>

        <thead>

          <tr>

            <th>ID</th>

            <th>Test</th>

            <th>Subject</th>

            <th>Date</th>

            <th>Total</th>

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
          ${Number(test.total || 0)}
        </td>


        <td>

          ${
            test.questionPaper
              ? `
                <a
                  href="${escapeHTML(test.questionPaper)}"
                  target="_blank"
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
          >
            👁️
          </button>


          <button
            class="action-btn"
            onclick="editTest('${test.id}')"
          >
            ✏️
          </button>


          <button
            class="action-btn"
            onclick="deleteTest('${test.id}')"
          >
            🗑️
          </button>

        </td>

      </tr>

    `).join("");

}


/* =========================================================
   ADD TEST
========================================================= */

function addTest() {

  const role =
    localStorage.getItem(
      "cms_role"
    );


  if (
    role !== "admin" &&
    role !== "teacher"
  ) {

    alert(
      "Only Admin and Teacher can create tests."
    );

    return;

  }


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


  saveTests(
    tests
  );


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


  saveTests(
    tests
  );


  testsPage();


  alert(
    "Test updated successfully! ✅"
  );

}


/* =========================================================
   DELETE TEST
========================================================= */

function deleteTest(id) {

  const role =
    localStorage.getItem(
      "cms_role"
    );


  if (
    role !== "admin" &&
    role !== "teacher"
  ) {

    alert(
      "You do not have permission."
    );

    return;

  }


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
   VIEW TEST
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


  const details =
    document.getElementById(
      "testDetails"
    );


  if (!details) return;


  if (!test.results) {

    test.results = {};

  }


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

              <th>
                Rank
              </th>

              <th>
                Student ID
              </th>

              <th>
                Student
              </th>

              <th>
                Class
              </th>

              <th>
                Batch
              </th>

              <th>
                Attendance
              </th>

              <th>
                Marks
              </th>

              <th>
                Percentage
              </th>

              <th>
                Average %
              </th>

            </tr>

          </thead>


          <tbody
            id="testStudentTable"
          ></tbody>

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
   RENDER TEST STUDENTS
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


  const stats =
    students.map(student => {

      let totalPercentage = 0;

      let count = 0;


      tests.forEach(item => {

        const result =
          item.results &&
          item.results[
            student.uid
          ];


        if (
          result &&
          result.present === true &&
          result.marks !== "" &&
          result.marks !== undefined
        ) {

          totalPercentage +=
            Number(result.marks) /
            Number(item.total || 1) *
            100;

          count++;

        }

      });


      return {

        student,

        average:
          count > 0
            ? totalPercentage / count
            : 0

      };

    });


  stats.sort(
    (a, b) =>
      b.average -
      a.average
  );


  const rankMap = {};


  stats.forEach(
    (item, index) => {

      rankMap[
        item.student.uid
      ] =
        index + 1;

    }
  );


  table.innerHTML =
    students.map(student => {

      const result =
        test.results &&
        test.results[
          student.uid
        ]
          ? test.results[
              student.uid
            ]
          : {
              marks: "",
              present: true
            };


      const marks =
        result.marks === undefined
          ? ""
          : result.marks;


      const percentage =
        marks !== ""
          ? Number(marks) /
            Number(test.total) *
            100
          : 0;


      const stat =
        stats.find(
          item =>
            item.student.uid ===
            student.uid
        );


      const average =
        stat
          ? stat.average
          : 0;


      return `

        <tr>

          <td>
            #${rankMap[student.uid]}
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
              oninput="
                updateCurrentPercentage(
                  '${student.uid}',
                  '${test.id}'
                )
              "
            >

          </td>


          <td
            id="percentage_${student.uid}"
          >

            ${
              marks !== "" &&
              result.present !== false
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


  students.forEach(student => {

    const select =
      document.getElementById(
        `present_${student.uid}`
      );


    if (!select) return;


    select.onchange =
      function() {

        const input =
          document.getElementById(
            `marks_${student.uid}`
          );


        const output =
          document.getElementById(
            `percentage_${student.uid}`
          );


        if (
          this.value ===
          "absent"
        ) {

          input.value = "";

          input.disabled =
            true;

          output.innerHTML =
            "-";

        } else {

          input.disabled =
            false;

        }

      };

  });


  const marksEntered =
    students.filter(student => {

      const result =
        test.results &&
        test.results[
          student.uid
        ];


      return (
        result &&
        result.present !== false &&
        result.marks !== "" &&
        result.marks !== undefined
      );

    });


  let totalPercentage = 0;


  marksEntered.forEach(student => {

    const result =
      test.results[
        student.uid
      ];


    totalPercentage +=
      Number(result.marks) /
      Number(test.total || 1) *
      100;

  });


  const average =
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
              Students
            </p>

            <h2>
              ${students.length}
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
              ${average.toFixed(2)}%
            </h2>

          </div>

        </div>

      </div>

    `;

  }

}


/* =========================================================
   LIVE PERCENTAGE
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


  if (
    !input ||
    !output
  ) return;


  if (
    input.value === ""
  ) {

    output.innerHTML =
      "-";

    return;

  }


  const marks =
    Number(input.value);


  if (
    isNaN(marks) ||
    marks < 0 ||
    marks > Number(test.total)
  ) {

    output.innerHTML =
      "Invalid";

    return;

  }


  const percentage =
    marks /
    Number(test.total) *
    100;


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

    const select =
      document.getElementById(
        `present_${student.uid}`
      );


    const input =
      document.getElementById(
        `marks_${student.uid}`
      );


    if (
      !select ||
      !input
    ) return;


    const present =
      select.value ===
      "present";


    const marks =
      input.value;


    if (!present) {

      test.results[
        student.uid
      ] = {

        present: false,

        marks: ""

      };

      return;

    }


    if (marks === "") {

      test.results[
        student.uid
      ] = {

        present: true,

        marks: ""

      };

      return;

    }


    const numericMarks =
      Number(marks);


    if (
      isNaN(numericMarks) ||
      numericMarks < 0 ||
      numericMarks >
        Number(test.total)
    ) {

      alert(
        `Invalid marks for ${student.name}.`
      );

      return;

    }


    test.results[
      student.uid
    ] = {

      present: true,

      marks:
        numericMarks

    };

  });


  saveTests(
    tests
  );


  viewTest(testId);


  alert(
    "Test results saved successfully! ✅"
  );

}


/* =========================================================
   STUDENT RESULTS
========================================================= */

function studentResultsPage() {

  const student =
    getCurrentStudent();


  if (!student) {

    logout();

    return;

  }


  const tests =
    getTests()
      .slice()
      .reverse();


  document.getElementById(
    "view"
  ).innerHTML = `

    <div class="topbar">

      <div>

        <h1>
          📊 My Results
        </h1>

        <p class="muted">
          Your personal test performance
        </p>

      </div>

    </div>


    <div class="stats-grid">

      <div class="stat-card">

        <div class="stat-icon">
          📈
        </div>

        <div>

          <p>
            Average
          </p>

          <h2>
            ${getStudentAverage(
              student.uid
            ).toFixed(2)}%
          </h2>

        </div>

      </div>


      <div class="stat-card">

        <div class="stat-icon">
          🏆
        </div>

        <div>

          <p>
            Rank
          </p>

          <h2>
            #${getStudentRank(
              student.uid
            )}
          </h2>

        </div>

      </div>

    </div>


    <div class="table-wrap">

      <table>

        <thead>

          <tr>

            <th>
              Test
            </th>

            <th>
              Subject
            </th>

            <th>
              Date
            </th>

            <th>
              Marks
            </th>

            <th>
              Percentage
            </th>

            <th>
              Attendance
            </th>

          </tr>

        </thead>


        <tbody>

          ${
            tests.length === 0

              ? `

                <tr>

                  <td
                    colspan="6"
                    style="text-align:center"
                  >
                    No tests available.
                  </td>

                </tr>

              `

              : tests.map(test => {

                  const result =
                    test.results &&
                    test.results[
                      student.uid
                    ];


                  if (!result) {

                    return `

                      <tr>

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
                          -
                        </td>

                        <td>
                          -
                        </td>

                        <td>
                          Not Attempted
                        </td>

                      </tr>

                    `;

                  }


                  if (
                    result.present ===
                    false
                  ) {

                    return `

                      <tr>

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
                          -
                        </td>

                        <td>
                          -
                        </td>

                        <td>
                          🔴 Absent
                        </td>

                      </tr>

                    `;

                  }


                  if (
                    result.marks === "" ||
                    result.marks === undefined
                  ) {

                    return `

                      <tr>

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
                          -
                        </td>

                        <td>
                          Result Pending
                        </td>

                        <td>
                          🟢 Present
                        </td>

                      </tr>

                    `;

                  }


                  const percentage =
                    Number(result.marks) /
                    Number(test.total || 1) *
                    100;


                  return `

                    <tr>

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
                        ${result.marks}
                        /
                        ${test.total}
                      </td>

                      <td>
                        <b>
                          ${percentage.toFixed(2)}%
                        </b>
                      </td>

                      <td>
                        🟢 Present
                      </td>

                    </tr>

                  `;

              }).join("")
          }

        </tbody>

      </table>

    </div>

  `;

}


/* =========================================================
   ATTENDANCE
========================================================= */

function attendancePage() {

  const role =
    localStorage.getItem(
      "cms_role"
    );


  if (role === "student") {

    studentAttendancePage();

    return;

  }


  document.getElementById(
    "view"
  ).innerHTML = `

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
        >


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

            <th>
              Date
            </th>

            <th>
              Student
            </th>

            <th>
              Status
            </th>

            ${
              role === "admin"
                ? "<th>Action</th>"
                : ""
            }

          </tr>

        </thead>


        <tbody
          id="attendanceTable"
        ></tbody>

      </table>

    </div>

  `;


  renderAttendance();

}


/* =========================================================
   STUDENT ATTENDANCE
========================================================= */

function studentAttendancePage() {

  const student =
    getCurrentStudent();


  if (!student) {

    logout();

    return;

  }


  const records =
    getAttendance()
      .filter(
        record =>
          record.studentUid ===
          student.uid
      )
      .slice()
      .reverse();


  const percentage =
    getStudentAttendancePercentage(
      student.uid
    );


  document.getElementById(
    "view"
  ).innerHTML = `

    <div class="topbar">

      <div>

        <h1>
          📅 My Attendance
        </h1>

        <p class="muted">
          Your attendance record
        </p>

      </div>

    </div>


    <div class="stats-grid">

      <div class="stat-card">

        <div class="stat-icon">
          📅
        </div>

        <div>

          <p>
            Attendance Percentage
          </p>

          <h2>
            ${percentage.toFixed(2)}%
          </h2>

        </div>

      </div>

    </div>


    <div class="table-wrap">

      <table>

        <thead>

          <tr>

            <th>
              Date
            </th>

            <th>
              Status
            </th>

          </tr>

        </thead>


        <tbody>

          ${
            records.length === 0

              ? `

                <tr>

                  <td
                    colspan="2"
                    style="text-align:center"
                  >
                    No attendance records yet.
                  </td>

                </tr>

              `

              : records.map(record => `

                  <tr>

                    <td>
                      ${escapeHTML(record.date)}
                    </td>

                    <td>
                      ${
                        record.status ===
                        "Present"
                          ? "🟢 Present"
                          : record.status ===
                            "Late"
                            ? "🟡 Late"
                            : "🔴 Absent"
                      }
                    </td>

                  </tr>

                `).join("")
          }

        </tbody>

      </table>

    </div>

  `;

}


/* =========================================================
   MARK ATTENDANCE
========================================================= */

function markAttendance() {

  const role =
    localStorage.getItem(
      "cms_role"
    );


  if (
    role !== "admin" &&
    role !== "teacher"
  ) {

    alert(
      "Only Admin and Teacher can mark attendance."
    );

    return;

  }


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


  if (
    !date ||
    !studentUid
  ) {

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


/* =========================================================
   RENDER ATTENDANCE
========================================================= */

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


  const role =
    localStorage.getItem(
      "cms_role"
    );


  table.innerHTML =
    records
      .slice()
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


            ${
              role === "admin"
                ? `

                  <td>

                    <button
                      class="action-btn"
                      onclick="deleteAttendance('${record.id}')"
                    >
                      🗑️
                    </button>

                  </td>

                `
                : ""
            }

          </tr>

        `;

      }).join("");

}


/* =========================================================
   DELETE ATTENDANCE
========================================================= */

function deleteAttendance(id) {

  if (
    localStorage.getItem(
      "cms_role"
    ) !== "admin"
  ) {

    alert(
      "Only Admin can delete attendance."
    );

    return;

  }


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

  if (
    localStorage.getItem(
      "cms_role"
    ) !== "admin"
  ) {

    alert(
      "Only Admin can manage fees."
    );

    return;

  }


  const students =
    getStudents();


  const collected =
    students.reduce(
      (sum, student) =>
        sum +
        Number(
          student.paid || 0
        ),
      0
    );


  const pending =
    students.reduce(
      (sum, student) =>
        sum +
        (
          Number(
            student.fees || 0
          ) -
          Number(
            student.paid || 0
          )
        ),
      0
    );


  document.getElementById(
    "view"
  ).innerHTML = `

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

        <select
          id="feeStudent"
        >

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
        >


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

            <th>
              ID
            </th>

            <th>
              Student
            </th>

            <th>
              Total Fees
            </th>

            <th>
              Paid
            </th>

            <th>
              Pending
            </th>

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


/* =========================================================
   COLLECT FEE
========================================================= */

function collectFee() {

  if (
    localStorage.getItem(
      "cms_role"
    ) !== "admin"
  ) {

    alert(
      "Only Admin can collect fees."
    );

    return;

  }


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
        item.uid ===
        studentUid
    );


  if (!student) return;


  const pending =
    Number(
      student.fees || 0
    ) -
    Number(
      student.paid || 0
    );


  if (
    amount > pending
  ) {

    alert(
      "Payment cannot be greater than pending fees."
    );

    return;

  }


  student.paid =
    Number(
      student.paid || 0
    ) +
    amount;


  saveStudents(
    students
  );


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


  saveFees(
    fees
  );


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


  document.getElementById(
    "view"
  ).innerHTML = `

    <div class="topbar">

      <div>

        <h1>
          Homework
        </h1>

        <p class="muted">
          Homework assignments
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


  const role =
    localStorage.getItem(
      "cms_role"
    );


  container.innerHTML =
    homework.map(item => `

      <div class="card">

        <h2>
          📚 ${escapeHTML(item.title)}
        </h2>

        <p>

          <b>
            Subject:
          </b>

          ${escapeHTML(item.subject)}

        </p>


        <p>

          <b>
            Due Date:
          </b>

          ${escapeHTML(item.due)}

        </p>


        ${
          role === "admin"
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

  const role =
    localStorage.getItem(
      "cms_role"
    );


  if (
    role !== "admin" &&
    role !== "teacher"
  ) {

    alert(
      "Only Admin and Teacher can add homework."
    );

    return;

  }


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


  saveHomework(
    homework
  );


  renderHomework();


  alert(
    "Homework added successfully! ✅"
  );

}


function deleteHomework(id) {

  if (
    localStorage.getItem(
      "cms_role"
    ) !== "admin"
  ) {

    alert(
      "Only Admin can delete homework."
    );

    return;

  }


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


  document.getElementById(
    "view"
  ).innerHTML = `

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
    getNotices()
      .slice()
      .reverse();


  const role =
    localStorage.getItem(
      "cms_role"
    );


  container.innerHTML =
    notices.map(notice => `

      <div class="card">

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
          role === "admin"
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

  if (
    localStorage.getItem(
      "cms_role"
    ) !== "admin"
  ) {

    alert(
      "Only Admin can add notices."
    );

    return;

  }


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


  saveNotices(
    notices
  );


  renderNotices();


  alert(
    "Notice added successfully! ✅"
  );

}


function deleteNotice(id) {

  if (
    localStorage.getItem(
      "cms_role"
    ) !== "admin"
  ) {

    alert(
      "Only Admin can delete notices."
    );

    return;

  }


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


  localStorage.removeItem(
    "cms_student_uid"
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
