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

/* =========================
   STUDENT DATA
========================= */

function getStudents() {
  const saved = localStorage.getItem("coaching_students");

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      return [...defaultStudents];
    }
  }

  return [...defaultStudents];
}

function saveStudents(data) {
  localStorage.setItem(
    "coaching_students",
    JSON.stringify(data)
  );
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
          />
        </div>

        <div class="field">
          <label>Password</label>

          <input
            id="password"
            type="password"
            placeholder="Enter password"
          />
        </div>

        <button
          class="primary"
          onclick="login()"
        >
          Login
        </button>

        <div class="demo-box">
          <b>Demo login</b><br><br>

          Admin: admin / 1234<br>
          Teacher: teacher / 1234<br>
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
  const role =
    document.getElementById("role").value;

  const id =
    document.getElementById("userId").value.trim();

  const password =
    document.getElementById("password").value;

  const valid =
    (role === "admin" && id === "admin") ||
    (role === "teacher" && id === "teacher") ||
    (role === "student" && id === "student");

  if (!valid || password !== "1234") {
    alert("Demo login details are incorrect.");
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
  const title =
    role.charAt(0).toUpperCase() +
    role.slice(1);

  document.getElementById("app").innerHTML = `
    <div class="layout">

      <aside class="sidebar">

        <div class="brand">
          🎓 Coaching Portal
        </div>

        <div class="nav">

          <button
            onclick="showHome('${role}')"
          >
            🏠 Dashboard
          </button>

          ${
            role !== "student"
              ? `
                <button
                  onclick="showStudents('${role}')"
                >
                  👨‍🎓 Students
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
          Logout
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
  const view =
    document.getElementById("view");

  if (role === "admin") {

    const students =
      getStudents();

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
        Recent activity
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
          <strong>${getStudents().length}</strong>
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
        Students needing attention
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
            Good morning, Rahul 👋
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
        Latest tests
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
              <td>Maths</td>
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
      />

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

        <tbody id="studentTable">
        </tbody>

      </table>

    </div>
  `;

  renderStudents();
}

/* =========================
   RENDER STUDENTS
========================= */

function renderStudents() {

  const table =
    document.getElementById(
      "studentTable"
    );

  if (!table) return;

  const searchBox =
    document.getElementById(
      "studentSearch"
    );

  const search =
    searchBox
      ? searchBox.value.toLowerCase()
      : "";

  const data =
    getStudents().filter(student => {

      return (
        student.id
          .toLowerCase()
          .includes(search) ||

        student.name
          .toLowerCase()
          .includes(search) ||

        student.batch
          .toLowerCase()
          .includes(search)
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

  table.innerHTML =
    data.map(student => `

      <tr>

        <td>${student.id}</td>

        <td>${student.name}</td>

        <td>${student.batch}</td>

        <td>${student.attendance}</td>

        <td>${student.average}</td>

        <td>

          <button
            onclick="editStudent('${student.id}')"
            title="Edit"
          >
            ✏️
          </button>

          <button
            onclick="deleteStudent('${student.id}')"
            title="Delete"
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

  const id =
    prompt("Enter Student ID:");

  if (!id) return;

  const cleanId =
    id.trim().toUpperCase();

  const data =
    getStudents();

  if (
    data.some(
      student =>
        student.id.toUpperCase() === cleanId
    )
  ) {

    alert(
      "Student ID already exists."
    );

    return;
  }

  const name =
    prompt("Enter Student Name:");

  if (!name) return;

  const batch =
    prompt(
      "Enter Batch/Class:",
      "Class 12 A"
    );

  if (!batch) return;

  const attendance =
    prompt(
      "Enter Attendance:",
      "0%"
    );

  if (!attendance) return;

  const average =
    prompt(
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

  alert(
    "Student added successfully! ✅"
  );
}

/* =========================
   EDIT STUDENT
========================= */

function editStudent(id) {

  const data =
    getStudents();

  const student =
    data.find(
      item => item.id === id
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
      "Batch/Class:",
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

  student.name =
    name.trim();

  student.batch =
    batch.trim();

  student.attendance =
    attendance.trim();

  student.average =
    average.trim();

  saveStudents(data);

  renderStudents();

  alert(
    "Student updated successfully! ✅"
  );
}

/* =========================
   DELETE STUDENT
========================= */

function deleteStudent(id) {

  const student =
    getStudents().find(
      item => item.id === id
    );

  if (!student) return;

  const confirmed =
    confirm(
      `Delete ${student.name}?`
    );

  if (!confirmed) return;

  const data =
    getStudents().filter(
      item => item.id !== id
    );

  saveStudents(data);

  renderStudents();

  alert(
    "Student deleted successfully."
  );
}

/* =========================
   TESTS
========================= */

function showTests(role) {

  const view =
    document.getElementById("view");

  view.innerHTML = `
    <div class="topbar">
      <div>
        <h1>Tests</h1>
        <p class="muted">
          Manage examinations and results
        </p>
      </div>
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
   STUDENT RESULTS
========================= */

function showResults() {

  const view =
    document.getElementById("view");

  view.innerHTML = `
    <div class="topbar">

      <div>
        <h1>My Results</h1>

        <p class="muted">
          Your test performance
        </p>
      </div>

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
        <h3>Tests Taken</h3>
        <strong>12</strong>
      </div>

      <div class="card">
        <h3>Rank</h3>
        <strong>#7</strong>
      </div>

    </div>

    <h2 class="section-title">
      Test Results
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
            <td>Completed</td>
          </tr>

          <tr>
            <td>Unit Test 3</td>
            <td>Chemistry</td>
            <td>76%</td>
            <td>Completed</td>
          </tr>

          <tr>
            <td>Unit Test 3</td>
            <td>Maths</td>
            <td>91%</td>
            <td>Completed</td>
          </tr>

        </tbody>

      </table>

    </div>
  `;
}

/* =========================
   ATTENDANCE
========================= */

function showAttendance(role) {

  const view =
    document.getElementById("view");

  const data =
    getStudents();

  view.innerHTML = `

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

          ${data.map(student => `

            <tr>

              <td>${student.id}</td>

              <td>${student.name}</td>

              <td>${student.batch}</td>

              <td>${student.attendance}</td>

            </tr>

          `).join("")}

        </tbody>

      </table>

    </div>
  `;
}

/* =========================
   MY ATTENDANCE
========================= */

function showMyAttendance() {

  const view =
    document.getElementById("view");

  view.innerHTML = `

    <div class="topbar">

      <div>
        <h1>My Attendance</h1>

        <p class="muted">
          Your attendance record
        </p>
      </div>

    </div>

    <div class="cards">

      <div class="card">
        <h3>Overall Attendance</h3>
        <strong>94%</strong>
      </div>

      <div class="card">
        <h3>Present</h3>
        <strong>94</strong>
      </div>

      <div class="card">
        <h3>Absent</h3>
        <strong>6</strong>
      </div>

      <div class="card">
        <h3>Status</h3>
        <strong>Good</strong>
      </div>

    </div>
  `;
}

/* =========================
   FEES
========================= */

function showFees(role) {

  const view =
    document.getElementById("view");

  view.innerHTML = `

    <div class="topbar">

      <div>
        <h1>Fees</h1>

        <p class="muted">
          Fee management
        </p>

      </div>

    </div>

    <div class="cards">

 

