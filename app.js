const studentsKey = "cms_students";

const defaultStudents = [
  {
    id: "ST001",
    name: "Rahul Kumar",
    batch: "Class 12 A",
    attendance: "94%",
    average: "82%"
  },
  {
    id: "ST002",
    name: "Priya Singh",
    batch: "Class 12 A",
    attendance: "91%",
    average: "88%"
  },
  {
    id: "ST003",
    name: "Aman Raj",
    batch: "Class 12 B",
    attendance: "78%",
    average: "69%"
  }
];

function getStudents() {
  try {
    const saved = localStorage.getItem(studentsKey);

    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.log(error);
  }

  return [...defaultStudents];
}

function saveStudents(students) {
  localStorage.setItem(
    studentsKey,
    JSON.stringify(students)
  );
}

function app() {
  return document.getElementById("app");
}

/* =========================
   LOGIN
========================= */

function loginPage() {

  app().innerHTML = `
    <div class="login-page">

      <div class="login-card">

        <div class="logo">🎓</div>

        <h1>Coaching Management</h1>

        <p class="muted">
          Sign in to your institute portal
        </p>

        <div class="field">

          <label>Role</label>

          <select id="role">

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

        </div>

        <div class="field">

          <label>User ID</label>

          <input
            id="userId"
            placeholder="Enter ID"
          >

        </div>

        <div class="field">

          <label>Password</label>

          <input
            id="password"
            type="password"
            placeholder="Enter password"
          >

        </div>

        <button
          class="primary"
          onclick="login()"
        >
          Login
        </button>

        <div class="demo-box">

          <b>Demo Login</b>

          <br><br>

          Admin: admin / 1234

          <br>

          Teacher: teacher / 1234

          <br>

          Student: student / 1234

        </div>

      </div>

    </div>
  `;
}

function login() {

  const role =
    document.getElementById("role").value;

  const id =
    document.getElementById("userId").value.trim();

  const password =
    document.getElementById("password").value;

  if (
    password === "1234" &&
    (
      (role === "admin" && id === "admin") ||
      (role === "teacher" && id === "teacher") ||
      (role === "student" && id === "student")
    )
  ) {

    localStorage.setItem(
      "cms_role",
      role
    );

    dashboard(role);

  } else {

    alert(
      "Incorrect login details.\n\nUse the demo credentials shown below."
    );

  }
}

/* =========================
   DASHBOARD
========================= */

function dashboard(role) {

  app().innerHTML = `

    <div class="layout">

      <aside class="sidebar">

        <div class="brand">
          🎓 Coaching Portal
        </div>

        <div class="nav">

          <button
            onclick="home('${role}')"
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
            onclick="testsPage('${role}')"
          >
            📝 Tests
          </button>

          <button
            onclick="attendancePage('${role}')"
          >
            📅 Attendance
          </button>

          ${
            role !== "teacher"
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
            onclick="homeworkPage('${role}')"
          >
            📚 Homework
          </button>

          <button
            onclick="noticesPage('${role}')"
          >
            📢 Notices
          </button>

        </div>

        <button
          class="logout"
          onclick="logout()"
        >
          🚪 Logout
        </button>

      </aside>

      <section
        class="content"
        id="view"
      ></section>

    </div>
  `;

  home(role);
}

/* =========================
   HOME
========================= */

function home(role) {

  const view =
    document.getElementById("view");

  const students =
    getStudents();

  if (role === "admin") {

    view.innerHTML = `

      <div class="topbar">

        <div>
          <h1>Admin Dashboard</h1>

          <p class="muted">
            Institute overview
          </p>
        </div>

        <b>👤 Admin</b>

      </div>

      <div class="cards">

        <div class="card">
          <h3>Total Students</h3>
          <strong>${students.length}</strong>
        </div>

        <div class="card">
          <h3>Teachers</h3>
          <strong>8</strong>
        </div>

        <div class="card">
          <h3>Fees Collected</h3>
          <strong>₹2.4L</strong>
        </div>

        <div class="card">
          <h3>Pending Fees</h3>
          <strong>₹32K</strong>
        </div>

      </div>

      <h2 class="section-title">
        Recent Activity
      </h2>

      <div class="card">
        📝 Class 12 A test results
        were updated today.
      </div>

      <div
        class="card"
        style="margin-top:12px"
      >
        💰 5 students have pending
        monthly fees.
      </div>

    `;

  } else if (role === "teacher") {

    view.innerHTML = `

      <div class="topbar">

        <div>
          <h1>Teacher Dashboard</h1>

          <p class="muted">
            Your classes and students
          </p>
        </div>

        <b>👨‍🏫 Teacher</b>

      </div>

      <div class="cards">

        <div class="card">
          <h3>My Students</h3>
          <strong>${students.length}</strong>
        </div>

        <div class="card">
          <h3>Today's Attendance</h3>
          <strong>93%</strong>
        </div>

        <div class="card">
          <h3>Tests</h3>
          <strong>12</strong>
        </div>

        <div class="card">
          <h3>Homework</h3>
          <strong>6</strong>
        </div>

      </div>

      <h2 class="section-title">
        Students Needing Attention
      </h2>

      <div class="card">
        🔴 Aman Raj · Average 69%
        · Attendance 78%
      </div>

    `;

  } else {

    view.innerHTML = `

      <div class="topbar">

        <div>
          <h1>
            Good Morning, Rahul 👋
          </h1>

          <p class="muted">
            Your learning overview
          </p>
        </div>

        <b>👨‍🎓 Student</b>

      </div>

      <div class="cards">

        <div class="card">
          <h3>Average</h3>
          <strong>82%</strong>
        </div>

        <div class="card">
          <h3>Best Score</h3>
          <strong>91%</strong>
        </div>

        <div class="card">
          <h3>Attendance</h3>
          <strong>94%</strong>
        </div>

        <div class="card">
          <h3>Rank</h3>
          <strong>#7</strong>
        </div>

      </div>

      <h2 class="section-title">
        Latest Tests
      </h2>

      <div class="table-wrap">

        <table>

          <thead>
            <tr>
              <th>Test</th>
              <th>Subject</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Unit Test 3</td>
              <td>Physics</td>
              <td>82%</td>
              <td>
                <span class="badge">
                  Completed
                </span>
              </td>
            </tr>

            <tr>
              <td>Unit Test 3</td>
              <td>Chemistry</td>
              <td>76%</td>
              <td>
                <span class="badge">
                  Completed
                </span>
              </td>
            </tr>

            <tr>
              <td>Unit Test 3</td>
              <td>Mathematics</td>
              <td>91%</td>
              <td>
                <span class="badge">
                  Completed
                </span>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    `;
  }
}

/* =========================
   STUDENTS
========================= */

function studentsPage() {

  const view =
    document.getElementById("view");

  view.innerHTML = `

    <div class="topbar">

      <div>
        <h1>Students</h1>

        <p class="muted">
          Manage student records
        </p>
      </div>

      <button
        class="primary"
        onclick="addStudent()"
      >
        ➕ Add Student
      </button>

    </div>

    <div
      class="card"
      style="margin-bottom:15px"
    >

      <input
        id="search"
        placeholder="🔍 Search students..."
        oninput="renderStudents()"
        style="
          width:100%;
          padding:13px;
          border:1px solid #d5dbe5;
          border-radius:10px;
        "
      >

    </div>

    <div class="table-wrap">

      <table>

        <thead>

          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Batch</th>
            <th>Attendance</th>
            <th>Average</th>
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
    document.getElementById("studentTable");

  if (!table) return;

  const search =
    document.getElementById("search")
      .value
      .toLowerCase();

  const students =
    getStudents().filter(student =>

      student.id.toLowerCase().includes(search) ||
      student.name.toLowerCase().includes(search) ||
      student.batch.toLowerCase().includes(search)

    );

  table.innerHTML = students.map(student => `

    <tr>

      <td>${student.id}</td>

      <td>${student.name}</td>

      <td>${student.batch}</td>

      <td>${student.attendance}</td>

      <td>${student.average}</td>

      <td>

        <button
          class="action-btn"
          onclick="editStudent('${student.id}')"
        >
          ✏️
        </button>

        <button
          class="action-btn"
          onclick="deleteStudent('${student.id}')"
        >
          🗑️
        </button>

      </td>

    </tr>

  `).join("");

  if (students.length === 0) {

    table.innerHTML = `
      <tr>
        <td colspan="6">
          No students found.
        </td>
      </tr>
    `;

  }
}

function addStudent() {

  const id =
    prompt("Student ID:");

  if (!id) return;

  const name =
    prompt("Student Name:");

  if (!name) return;

  const batch =
    prompt(
      "Batch/Class:",
      "Class 12 A"
    );

  if (!batch) return;

  const attendance =
    prompt(
      "Attendance:",
      "90%"
    );

  if (!attendance) return;

  const average =
    prompt(
      "Average:",
      "80%"
    );

  if (!average) return;

  const students =
    getStudents();

  students.push({
    id: id.trim().toUpperCase(),
    name: name.trim(),
    batch: batch.trim(),
    attendance: attendance.trim(),
    average: average.trim()
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
      s => s.id === id
    );

  if (!student) return;

  const name =
    prompt(
      "Student Name:",
      student.name
    );

  if (!name) return;

  const batch =
    prompt(
      "Batch:",
      student.batch
    );

  if (!batch) return;

  const attendance =
    prompt(
      "Attendance:",
      student.attendance
    );

  if (!attendance) return;

  const average =
    prompt(
      "Average:",
      student.average
    );

  if (!average) return;

  student.name = name;
  student.batch = batch;
  student.attendance = attendance;
  student.average = average;

  saveStudents(students);

  renderStudents();

  alert(
    "Student updated! ✅"
  );
}

function deleteStudent(id) {

  const students =
    getStudents();

  const student =
    students.find(
      s => s.id === id
    );

  if (!student) return;

  if (
    !confirm(
      `Delete ${student.name}?`
    )
  ) return;

  const updated =
    students.filter(
      s => s.id !== id
    );

  saveStudents(updated);

  renderStudents();
}

/* =========================
   TEACHERS
========================= */

function teachersPage() {

  document.getElementById("view").innerHTML = `

    <div class="topbar">

      <div>
        <h1>Teachers</h1>

        <p class="muted">
          Teaching staff
        </p>
      </div>

    </div>

    <div class="table-wrap">

      <table>

        <thead>

          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Subject</th>
            <th>Batch</th>
          </tr>

        </thead>

        <tbody>

          <tr>
            <td>T001</td>
            <td>Rajesh Kumar</td>
            <td>Physics</td>
            <td>Class 12 A</td>
          </tr>

          <tr>
            <td>T002</td>
            <td>Neha Singh</td>
            <td>Chemistry</td>
            <td>Class 12 A</td>
          </tr>

          <tr>
            <td>T003</td>
            <td>Amit Sharma</td>
            <td>Mathematics</td>
            <td>Class 12 B</td>
          </tr>

        </tbody>

      </table>

    </div>
  `;
}

/* =========================
   TESTS
========================= */

function testsPage(role) {

  document.getElementById("view").innerHTML = `

    <div class="topbar">

      <div>
        <h1>Tests</h1>

        <p class="muted">
          Examinations and results
        </p>
      </div>

      ${
        role !== "student"
          ? `
            <button
              class="primary"
              onclick="alert('Test creation will be added next.')"
            >
              ➕ Create Test
            </button>
          `
          : ""
      }

    </div>

    <div class="cards">

      <div class="card">
        <h3>Total Tests</h3>
        <strong>12</strong>
      </div>

      <div class="card">
        <h3>Upcoming</h3>
        <strong>3</strong>
      </div>

      <div class="card">
        <h3>Completed</h3>
        <strong>9</strong>
      </div>

      <div class="card">
        <h3>Average Score</h3>
        <strong>78%</strong>
      </div>

    </div>

    <h2 class="section-title">
      Recent Tests
    </h2>

    <div class="table-wrap">

      <table>

        <thead>
          <tr>
            <th>Test</th>
            <th>Subject</th>
            <th>Batch</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          <tr>
            <td>Unit Test 3</td>
            <td>Physics</td>
            <td>Class 12 A</td>
            <td>
              <span class="badge">
                Completed
              </span>
            </td>
          </tr>

          <tr>
            <td>Unit Test 3</td>
            <td>Chemistry</td>
            <td>Class 12 A</td>
            <td>
              <span class="badge">
                Completed
              </span>
            </td>
          </tr>

          <tr>
            <td>Monthly Test</td>
            <td>Mathematics</td>
            <td>Class 12 B</td>
            <td>
              <span class="badge">
                Upcoming
              </span>
            </td>
          </tr>

        </tbody>

      </table>

    </div>
  `;
}

/* =========================
   ATTENDANCE
========================= */

function attendancePage(role) {

  const students =
    getStudents();

  document.getElementById("view").innerHTML = `

    <div class="topbar">

      <div>
        <h1>Attendance</h1>

        <p class="muted">
          Student attendance records
        </p>
      </div>

    </div>

    <div class="table-wrap">

      <table>

        <thead>

          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Batch</th>
            <th>Attendance</th>
          </tr>

        </thead>

        <tbody>

          ${
            students.map(student => `

              <tr>

                <td>${student.id}</td>

                <td>${student.name}</td>

                <td>${student.batch}</td>

                <td>${student.attendance}</td>

              </tr>

            `).join("")
          }

        </tbody>

      </table>

    </div>
  `;
}

/* =========================
   FEES
========================= */

function feesPage() {

  document.getElementById("view").innerHTML = `

    <div class="topbar">

      <div>
        <h1>Fees</h1>

        <p class="muted">
          Fee management
        </p>
      </div>

    </div>

    <div class="cards">

      <div class="card">
        <h3>Total Fees</h3>
        <strong>₹2.72L</strong>
      </div>

      <div class="card">
        <h3>Collected</h3>
        <strong>₹2.40L</strong>
      </div>

      <div class="card">
        <h3>Pending</h3>
        <strong>₹32K</strong>
      </div>

      <div class="card">
        <h3>Students</h3>
        <strong>${getStudents().length}</strong>
      </div>

    </div>

    <h2 class="section-title">
      Fee Status
    </h2>

    <div class="table-wrap">

      <table>

        <thead>

          <tr>
            <th>Student</th>
            <th>Batch</th>
            <th>Fee</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          <tr>
            <td>Rahul Kumar</td>
            <td>Class 12 A</td>
            <td>₹5,000</td>
            <td>
              <span class="badge">
                Paid
              </span>
            </td>
          </tr>

          <tr>
            <td>Priya Singh</td>
            <td>Class 12 A</td>
            <td>₹5,000</td>
            <td>
              <span class="badge">
                Paid
              </span>
            </td>
          </tr>

          <tr>
            <td>Aman Raj</td>
            <td>Class 12 B</td>
            <td>₹5,000</td>
            <td>
              <span class="badge">
                Pending
              </span>
            </td>
          </tr>

        </tbody>

      </table>

    </div>
  `;
}

/* =========================
   HOMEWORK
========================= */

function homeworkPage(role) {

  document.getElementById("view").innerHTML = `

    <div class="topbar">

      <div>
        <h1>Homework</h1>

        <p class="muted">
          Assignments and study work
        </p>
      </div>

    </div>

    <div class="table-wrap">

      <table>

        <thead>

          <tr>
            <th>Subject</th>
            <th>Homework</th>
            <th>Batch</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          <tr>
            <td>Physics</td>
            <td>Electrostatics Questions</td>
            <td>Class 12 A</td>
            <td>
              <span class="badge">
                Active
              </span>
            </td>
          </tr>

          <tr>
            <td>Chemistry</td>
            <td>Organic Chemistry Revision</td>
            <td>Class 12 A</td>
            <td>
              <span class="badge">
                Active
              </span>
            </td>
          </tr>

          <tr>
            <td>Mathematics</td>
            <td>Integration Practice</td>
            <td>Class 12 B</td>
            <td>
              <span class="badge">
                Active
              </span>
            </td>
          </tr>

        </tbody>

      </table>

    </div>
  `;
}

/* =========================
   NOTICES
========================= */

function noticesPage(role) {

  document.getElementById("view").innerHTML = `

    <div class="topbar">

      <div>
        <h1>Notices</h1>

        <p class="muted">
          Institute announcements
        </p>
      </div>

    </div>

    <div class="card">

      <h3>
        📢 Monthly Test
      </h3>

      <p>
        Monthly test will be conducted
        this Saturday.
      </p>

    </div>

    <div
      class="card"
      style="margin-top:12px"
    >

      <h3>
        📢 Fee Reminder
      </h3>

      <p>
        Please complete pending fees
        before the 15th.
      </p>

    </div>
  `;
}

/* =========================
   LOGOUT
========================= */

function logout() {

  localStorage.removeItem(
    "cms_role"
  );

  loginPage();
}

/* =========================
   START
========================= */

const savedRole =
  localStorage.getItem("cms_role");

if (
  savedRole === "admin" ||
  savedRole === "teacher" ||
  savedRole === "student"
) {

  dashboard(savedRole);

} else {

  loginPage();

}
