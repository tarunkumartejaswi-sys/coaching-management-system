/* =====================================================
   COACHING MANAGEMENT SYSTEM
   Complete Frontend Application
===================================================== */

/* =========================
   DEFAULT DATA
========================= */

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

const defaultHomework = [
  {
    subject: "Physics",
    title: "Electrostatics Questions",
    batch: "Class 12 A",
    date: "Today"
  },
  {
    subject: "Chemistry",
    title: "Organic Chemistry Revision",
    batch: "Class 12 A",
    date: "Yesterday"
  },
  {
    subject: "Mathematics",
    title: "Integration Practice",
    batch: "Class 12 B",
    date: "Yesterday"
  }
];

const defaultNotices = [
  {
    title: "Monthly Test",
    message: "Monthly test will be conducted this Saturday.",
    date: "Today"
  },
  {
    title: "Fee Reminder",
    message: "Please complete pending fees before the 15th.",
    date: "Yesterday"
  }
];

/* =========================
   STORAGE HELPERS
========================= */

function getData(key, fallback) {
  const saved = localStorage.getItem(key);

  if (!saved) {
    return JSON.parse(JSON.stringify(fallback));
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    return JSON.parse(JSON.stringify(fallback));
  }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getStudents() {
  return getData("coaching_students", defaultStudents);
}

function saveStudents(data) {
  saveData("coaching_students", data);
}

function getTeachers() {
  return getData("coaching_teachers", defaultTeachers);
}

function saveTeachers(data) {
  saveData("coaching_teachers", data);
}

function getHomework() {
  return getData("coaching_homework", defaultHomework);
}

function saveHomework(data) {
  saveData("coaching_homework", data);
}

function getNotices() {
  return getData("coaching_notices", defaultNotices);
}

function saveNotices(data) {
  saveData("coaching_notices", data);
}

/* =========================
   HELPERS
========================= */

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function today() {
  return new Date().toLocaleDateString("en-IN");
}

function money(value) {
  return "₹" + Number(value).toLocaleString("en-IN");
}

/* =========================
   LOGIN PAGE
========================= */

function loginPage() {
  document.getElementById("app").innerHTML = `
    <div class="login-page">

      <div class="login-card">

        <div class="logo">🎓</div>

        <h1>Coaching Management</h1>

        <p class="muted">
          Sign in to your institute portal
        </p>

        <div class="field">
          <label>Role</label>

          <select
            id="role"
            style="
              width:100%;
              padding:13px;
              border:1px solid #d8deea;
              border-radius:12px;
              box-sizing:border-box;
            "
          >
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
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

/* =========================
   LOGIN
========================= */

function login() {
  const roleElement = document.getElementById("role");
  const idElement = document.getElementById("userId");
  const passwordElement = document.getElementById("password");

  if (!roleElement || !idElement || !passwordElement) {
    return;
  }

  const role = roleElement.value;
  const id = idElement.value.trim();
  const password = passwordElement.value;

  const valid =
    (role === "admin" && id === "admin") ||
    (role === "teacher" && id === "teacher") ||
    (role === "student" && id === "student");

  if (!valid || password !== "1234") {
    alert("Incorrect login details.");
    return;
  }

  localStorage.setItem(
    "coaching_current_role",
    role
  );

  dashboard(role);
}

/* =========================
   MAIN DASHBOARD
========================= */

function dashboard(role) {
  document.getElementById("app").innerHTML = `
    <div class="layout">

      <aside class="sidebar">

        <div class="brand">
          🎓 Coaching Portal
        </div>

        <div class="nav">

          <button onclick="showHome('${role}')">
            🏠 Dashboard
          </button>

          ${
            role !== "student"
              ? `
                <button onclick="showStudents('${role}')">
                  👨‍🎓 Students
                </button>
              `
              : ""
          }

          ${
            role === "admin"
              ? `
                <button onclick="showTeachers()">
                  👨‍🏫 Teachers
                </button>
              `
              : ""
          }

          ${
            role !== "student"
              ? `
                <button onclick="showTests('${role}')">
                  📝 Tests
                </button>
              `
              : `
                <button onclick="showResults()">
                  📊 My Results
                </button>
              `
          }

          ${
            role !== "student"
              ? `
                <button onclick="showAttendance('${role}')">
                  📅 Attendance
                </button>
              `
              : `
                <button onclick="showMyAttendance()">
                  📅 My Attendance
                </button>
              `
          }

          ${
            role !== "teacher"
              ? `
                <button onclick="showFees('${role}')">
                  💰 Fees
                </button>
              `
              : ""
          }

          <button onclick="showHomework('${role}')">
            📚 Homework
          </button>

          <button onclick="showNotices('${role}')">
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

  showHome(role);
}

/* =========================
   LOGOUT
========================= */

function logout() {
  localStorage.removeItem(
    "coaching_current_role"
  );

  loginPage();
}

/* =========================
   HOME DASHBOARD
========================= */

function showHome(role) {
  const view = document.getElementById("view");

  if (!view) return;

  const students = getStudents();

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
          <strong>${getTeachers().length}</strong>
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
        📝 Class 12 A test results were
        updated today.
      </div>

      <div
        class="card"
        style="margin-top:10px"
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
          <strong>${getHomework().length}</strong>
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

function showStudents(role) {
  const view = document.getElementById("view");

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
        id="studentSearch"
        placeholder="🔍 Search by ID, name or batch..."
        oninput="renderStudents()"
        style="
          width:100%;
          padding:13px;
          border:1px solid #d8deea;
          border-radius:12px;
          box-sizing:border-box;
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

/* =========================
   RENDER STUDENTS
========================= */

function renderStudents() {
  const table = document.getElementById("studentTable");

  if (!table) return;

  const searchBox =
    document.getElementById("studentSearch");

  const search = searchBox
    ? searchBox.value.toLowerCase()
    : "";

  const data = getStudents().filter(student => {

    return (
      String(student.id).toLowerCase().includes(search) ||
      String(student.name).toLowerCase().includes(search) ||
      String(student.batch).toLowerCase().includes(search)
    );

  });

  if (data.length === 0) {

    table.innerHTML = `
      <tr>
        <td
          colspan="6"
          style="text-align:center;padding:30px"
        >
          No students found.
        </td>
      </tr>
    `;

    return;
  }

  table.innerHTML = data.map(student => `

    <tr>

      <td>${escapeHTML(student.id)}</td>

      <td>${escapeHTML(student.name)}</td>

      <td>${escapeHTML(student.batch)}</td>

      <td>${escapeHTML(student.attendance)}</td>

      <td>${escapeHTML(student.average)}</td>

      <td>

        <button
          onclick="editStudent('${escapeHTML(student.id)}')"
        >
          ✏️
        </button>

        <button
          onclick="deleteStudent('${escapeHTML(student.id)}')"
        >
          🗑️
        </button>

      </td>

    </tr>

  `).join("");
}

/* =========================
   ADD STUDENT
========================= */

function addStudent() {
  const id = prompt("Enter Student ID:");

  if (!id) return;

  const cleanId = id.trim().toUpperCase();

  const data = getStudents();

  if (
    data.some(
      student =>
        student.id.toUpperCase() === cleanId
    )
  ) {
    alert("Student ID already exists.");
    return;
  }

  const name = prompt("Enter Student Name:");

  if (!name) return;

  const batch = prompt(
    "Enter Batch/Class:",
    "Class 12 A"
  );

  if (!batch) return;

  const attendance = prompt(
    "Enter Attendance:",
    "0%"
  );

  if (!attendance) return;

  const average = prompt(
    "Enter Average:",
    "0%"
  );

  if (!average) return;

  data.push({
    id: cleanId,
    name: name.trim(),
    batch: batch.trim(),
    attendance: attendance.trim(),
    average: average.trim()
  });

  saveStudents(data);

  renderStudents();

  alert("Student added successfully! ✅");
}

/* =========================
   EDIT STUDENT
========================= */

function editStudent(id) {
  const data = getStudents();

  const student = data.find(
    item => item.id === id
  );

  if (!student) return;

  const name = prompt(
    "Student Name:",
    student.name
  );

  if (!name) return;

  const batch = prompt(
    "Batch/Class:",
    student.batch
  );

  if (!batch) return;

  const attendance = prompt(
    "Attendance:",
    student.attendance
  );

  if (!attendance) return;

  const average = prompt(
    "Average:",
    student.average
  );

  if (!average) return;

  student.name = name.trim();
  student.batch = batch.trim();
  student.attendance = attendance.trim();
  student.average = average.trim();

  saveStudents(data);

  renderStudents();

  alert("Student updated successfully! ✅");
}

/* =========================
   DELETE STUDENT
========================= */

function deleteStudent(id) {
  const student = getStudents().find(
    item => item.id === id
  );

  if (!student) return;

  const confirmed = confirm(
    `Delete ${student.name}?`
  );

  if (!confirmed) return;

  const data = getStudents().filter(
    item => item.id !== id
  );

  saveStudents(data);

  renderStudents();

  alert("Student deleted successfully.");
}

/* =========================
   TEACHERS
========================= */

function showTeachers() {
  const view = document.getElementById("view");

  view.innerHTML = `
    <div class="topbar">

      <div>
        <h1>Teachers</h1>

        <p class="muted">
          Manage teaching staff
        </p>
      </div>

      <button
        class="primary"
        onclick="addTeacher()"
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
            <th>Action</th>
          </tr>
        </thead>

        <tbody id="teacherTable"></tbody>

      </table>

    </div>
  `;

  renderTeachers();
}

function renderTeachers() {
  const table = document.getElementById("teacherTable");

  if (!table) return;

  const data = getTeachers();

  table.innerHTML = data.map(teacher => `

    <tr>

      <td>${escapeHTML(teacher.id)}</td>

      <td>${escapeHTML(teacher.name)}</td>

      <td>${escapeHTML(teacher.subject)}</td>

      <td>${escapeHTML(teacher.batch)}</td>

      <td>
        <button
          onclick="deleteTeacher('${escapeHTML(teacher.id)}')"
        >
          🗑️
        </button>
      </td>

    </tr>

  `).join("");
}

function addTeacher() {
  const id = prompt("Enter Teacher ID:");

  if (!id) return;

  const cleanId = id.trim().toUpperCase();

  const data = getTeachers();

  if (
    data.some(
      teacher => teacher.id === cleanId
    )
  ) {
    alert("Teacher ID already exists.");
    return;
  }

  const name = prompt("Enter Teacher Name:");

  if (!name) return;

  const subject = prompt(
    "Enter Subject:",
    "Physics"
  );

  if (!subject) return;

  const batch = prompt(
    "Enter Batch:",
    "Class 12 A"
  );

  if (!batch) return;

  data.push({
    id: cleanId,
    name: name.trim(),
    subject: subject.trim(),
    batch: batch.trim()
  });

  saveTeachers(data);

  renderTeachers();

  alert("Teacher added successfully! ✅");
}

function deleteTeacher(id) {
  const teacher = getTeachers().find(
    item => item.id === id
  );

  if (!teacher) return;

  if (!confirm(`Delete ${teacher.name}?`)) {
    return;
  }

  const data = getTeachers().filter(
    item => item.id !== id
  );

  saveTeachers(data);

  renderTeachers();

  alert("Teacher deleted successfully.");
}

/* =========================
   TESTS
========================= */

function showTests(role) {
  const view = document.getElementById("view");

  view.innerHTML = `
    <div class="topbar">

      <div>
        <h1>Tests</h1>

        <p class="muted">
          Manage examinations and results
        </p>
      </div>

      ${
        role === "admin" || role === "teacher"
          ? `
            <button
              class="primary"
              onclick="createTest()"
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
        <strong>12</st
        

