/* =========================================================
   COACHING MANAGEMENT SYSTEM
   Lightweight localStorage version
   Designed for small coaching institute
   Nursery -> Class 9
========================================================= */

const DB_KEY = "cms_v3_database";
const SESSION_KEY = "cms_v3_session";

const CLASS_LIST = [
  "Nursery",
  "LKG",
  "UKG",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9"
];

const SUBJECTS = [
  "English",
  "Hindi",
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Social Science",
  "Computer",
  "General"
];

const NAV = [
  ["dashboard", "🏠", "Dashboard", ["admin", "teacher", "student"]],
  ["students", "👨‍🎓", "Students", ["admin", "teacher"]],
  ["teachers", "👨‍🏫", "Teachers", ["admin"]],
  ["classes", "🏫", "Classes", ["admin", "teacher"]],
  ["tests", "📝", "Tests & Results", ["admin", "teacher", "student"]],
  ["attendance", "📅", "Attendance", ["admin", "teacher", "student"]],
  ["fees", "💰", "Fees", ["admin", "student"]],
  ["homework", "📚", "Homework", ["admin", "teacher", "student"]],
  ["notices", "📢", "Notices", ["admin", "teacher", "student"]],
  ["reports", "📊", "Reports", ["admin"]],
  ["settings", "⚙️", "Settings", ["admin"]]
];

let db = loadDB();
let currentPage = "dashboard";
let selectedStudentId = null;
let selectedTestId = null;
let currentStudentTab = "overview";
let searchTerm = "";
let currentUser = loadSession();

function uid(prefix = "ID") {
  return prefix + "_" + Date.now().toString(36) + "_" +
    Math.random().toString(36).slice(2, 7);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function money(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN");
}

function percentage(value) {
  return Number(value || 0).toFixed(1) + "%";
}

function saveDB() {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function saveSession(user) {
  currentUser = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  currentUser = null;
  render();
}

function defaultDB() {
  return {
    settings: {
      instituteName: "Coaching Portal",
      address: "",
      phone: "",
      email: "",
      academicYear: "2026-27"
    },

    students: [
      {
        uid: uid("STU"),
        id: "ST001",
        name: "Rahul Kumar",
        className: "Class 8",
        batch: "Morning",
        phone: "",
        guardian: "Parent",
        guardianPhone: "",
        admissionDate: "2026-04-01",
        totalFees: 24000,
        paidFees: 16000,
        active: true
      },
      {
        uid: uid("STU"),
        id: "ST002",
        name: "Priya Singh",
        className: "Class 8",
        batch: "Morning",
        phone: "",
        guardian: "Parent",
        guardianPhone: "",
        admissionDate: "2026-04-01",
        totalFees: 24000,
        paidFees: 24000,
        active: true
      },
      {
        uid: uid("STU"),
        id: "ST003",
        name: "Aman Raj",
        className: "Class 7",
        batch: "Evening",
        phone: "",
        guardian: "Parent",
        guardianPhone: "",
        admissionDate: "2026-04-01",
        totalFees: 24000,
        paidFees: 12000,
        active: true
      }
    ],

    teachers: [
      {
        uid: uid("TEA"),
        id: "T001",
        name: "Rajesh Kumar",
        subjects: ["Physics", "Science"],
        classes: ["Class 8", "Class 9"],
        phone: "",
        email: "",
        active: true
      },
      {
        uid: uid("TEA"),
        id: "T002",
        name: "Neha Singh",
        subjects: ["Chemistry", "Science"],
        classes: ["Class 7", "Class 8"],
        phone: "",
        email: "",
        active: true
      },
      {
        uid: uid("TEA"),
        id: "T003",
        name: "Amit Sharma",
        subjects: ["Mathematics"],
        classes: ["Class 6", "Class 7", "Class 8", "Class 9"],
        phone: "",
        email: "",
        active: true
      }
    ],

    tests: [
      {
        id: "TEST001",
        name: "Science Monthly Test",
        subject: "Science",
        className: "Class 8",
        date: today(),
        total: 50,
        questionPaper: "",
        solution: "",
        results: {}
      }
    ],

    attendance: {},

    payments: [
      {
        id: uid("PAY"),
        studentUid: "",
        amount: 0,
        date: today(),
        month: "",
        method: "Cash",
        note: ""
      }
    ].filter(x => x.amount > 0),

    homework: [
      {
        id: uid("HW"),
        subject: "Mathematics",
        title: "Integration Practice",
        className: "Class 8",
        assignedDate: today(),
        dueDate: today(),
        description: "Complete the assigned practice questions.",
        attachment: "",
        active: true
      }
    ],

    notices: [
      {
        id: uid("NOT"),
        title: "Monthly Test",
        message: "Monthly test will be conducted this Saturday.",
        date: today(),
        audience: "All",
        priority: "Normal",
        expiry: "",
        active: true
      },
      {
        id: uid("NOT"),
        title: "Fee Reminder",
        message: "Please complete pending fees before the 15th.",
        date: today(),
        audience: "All",
        priority: "Important",
        expiry: "",
        active: true
      }
    ],

    activity: [
      {
        icon: "🎓",
        text: "Coaching Management System initialized.",
        date: today()
      }
    ]
  };
}

function loadDB() {
  try {
    const old = JSON.parse(localStorage.getItem(DB_KEY));

    if (old) {
      old.students ||= [];
      old.teachers ||= [];
      old.tests ||= [];
      old.attendance ||= {};
      old.payments ||= [];
      old.homework ||= [];
      old.notices ||= [];
      old.activity ||= [];
      old.settings ||= defaultDB().settings;

      old.students.forEach(s => {
        if (!s.uid) s.uid = uid("STU");
        if (!s.className) s.className = s.batch || "Class 1";
        if (s.totalFees == null) s.totalFees = 0;
        if (s.paidFees == null) s.paidFees = 0;
      });

      old.teachers.forEach(t => {
        if (!t.uid) t.uid = uid("TEA");
        if (!Array.isArray(t.subjects)) {
          t.subjects = t.subject ? [t.subject] : [];
        }
        if (!Array.isArray(t.classes)) {
          t.classes = t.batch ? [t.batch] : [];
        }
      });

      old.tests.forEach(t => {
        t.results ||= {};
        t.className ||= "";
        t.total ||= 100;
      });

      return old;
    }
  } catch (e) {
    console.warn("Database migration failed", e);
  }

  const fresh = defaultDB();
  saveFresh(fresh);
  return fresh;
}

function saveFresh(data) {
  db = data;
  saveDB();
}

/* =========================================================
   AUTHENTICATION
========================================================= */

const ACCOUNTS = [
  {
    username: "admin",
    password: "1234",
    role: "admin",
    name: "Admin"
  },
  {
    username: "teacher",
    password: "1234",
    role: "teacher",
    name: "Teacher"
  },
  {
    username: "student",
    password: "1234",
    role: "student",
    name: "Student"
  }
];

function renderLogin() {
  document.getElementById("app").innerHTML = `
    <div class="login-page">
      <div class="login-card">
        <div class="logo-large">🎓</div>
        <h1>${esc(db.settings.instituteName)}</h1>
        <p class="login-subtitle">
          Coaching Management System
        </p>

        <form onsubmit="login(event)">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input id="loginUsername" class="input" required placeholder="Enter username">
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input id="loginPassword" type="password" class="input" required placeholder="Enter password">
          </div>

          <button class="btn btn-primary" style="width:100%">
            🔐 Login
          </button>
        </form>

        <div class="login-info">
          <strong>Demo accounts</strong><br>
          Admin: admin / 1234<br>
          Teacher: teacher / 1234<br>
          Student: student / 1234
        </div>
      </div>
    </div>
  `;
}

function login(event) {
  event.preventDefault();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  const account = ACCOUNTS.find(
    x => x.username === username && x.password === password
  );

  if (!account) {
    showToast("Invalid username or password", "error");
    return;
  }

  saveSession(account);
  currentPage = "dashboard";
  render();
  showToast("Welcome, " + account.name + "!", "success");
}

/* =========================================================
   MAIN APP
========================================================= */

function allowed(page) {
  const item = NAV.find(x => x[0] === page);
  return item ? item[3].includes(currentUser.role) : false;
}

function render() {
  if (!currentUser) {
    renderLogin();
    return;
  }

  if (!allowed(currentPage)) {
    currentPage = "dashboard";
  }

  document.getElementById("app").innerHTML = `
    <div class="app-layout">
      ${sidebarHTML()}
      <main class="main">
        ${topbarHTML()}
        <div id="pageContent"></div>
      </main>
    </div>

    <div id="modalRoot"></div>
    <div id="toastContainer" class="toast-container"></div>
  `;

  renderPage();
}

function sidebarHTML() {
  return `
    <aside class="sidebar" id="sidebar">
      <div class="brand">
        <span>🎓</span>${esc(db.settings.instituteName)}
      </div>

      <nav class="nav">
        ${NAV.filter(item => item[3].includes(currentUser.role))
          .map(item => `
            <button
              class="nav-item ${currentPage === item[0] ? "active" : ""}"
              onclick="navigate('${item[0]}')"
            >
              <span>${item[1]}</span>
              <span>${item[2]}</span>
            </button>
          `).join("")}
      </nav>

      <div class="sidebar-bottom">
        <button class="nav-item logout-btn" onclick="logout()">
          🚪 Logout
        </button>
      </div>
    </aside>
  `;
}

function topbarHTML() {
  return `
    <header class="topbar">
      <div style="display:flex;align-items:center;gap:12px;">
        <button class="mobile-menu" onclick="toggleSidebar()">☰</button>

        <div class="top-search">
          <span>🔍</span>
          <input
            placeholder="Search students, teachers, tests..."
            value="${esc(searchTerm)}"
            oninput="globalSearch(this.value)"
          >
        </div>
      </div>

      <div class="user-area">
        <div class="user-avatar">
          ${currentUser.role === "admin" ? "👑" :
            currentUser.role === "teacher" ? "👨‍🏫" : "👨‍🎓"}
        </div>

        <div>
          <strong>${esc(currentUser.name)}</strong>
          <div style="font-size:12px;color:#64748b;text-transform:capitalize;">
            ${esc(currentUser.role)}
          </div>
        </div>
      </div>
    </header>
  `;
}

function toggleSidebar() {
  document.getElementById("sidebar")?.classList.toggle("open");
}

function navigate(page) {
  if (!allowed(page)) return;

  currentPage = page;
  selectedStudentId = null;
  selectedTestId = null;
  searchTerm = "";

  render();

  if (window.innerWidth <= 800) {
    document.getElementById("sidebar")?.classList.remove("open");
  }
}

function globalSearch(value) {
  searchTerm = value.trim().toLowerCase();

  if (!searchTerm) {
    return;
  }

  if (currentPage !== "students") {
    currentPage = "students";
  }

  render();
}

/* =========================================================
   PAGE ROUTER
========================================================= */

function renderPage() {
  const content = document.getElementById("pageContent");

  const pages = {
    dashboard: renderDashboard,
    students: renderStudents,
    teachers: renderTeachers,
    classes: renderClasses,
    tests: renderTests,
    attendance: renderAttendance,
    fees: renderFees,
    homework: renderHomework,
    notices: renderNotices,
    reports: renderReports,
    settings: renderSettings
  };

  content.innerHTML = pages[currentPage]();
}

/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {
  const activeStudents = db.students.filter(s => s.active !== false);
  const totalStudents = activeStudents.length;
  const totalTeachers = db.teachers.filter(t => t.active !== false).length;

  const collected = activeStudents.reduce(
    (sum, s) => sum + Number(s.paidFees || 0), 0
  );

  const expected = activeStudents.reduce(
    (sum, s) => sum + Number(s.totalFees || 0), 0
  );

  const pending = Math.max(0, expected - collected);

  const att = attendanceSummary(today());

  return `
    <div class="page">

      <div class="welcome">
        <h2>Good ${getGreeting()}, ${esc(currentUser.name)} 👋</h2>
        <p>${formatDate(today())} • Institute Overview</p>
      </div>

      <div class="stats-grid">

        ${statCard("👨‍🎓", "Students", totalStudents)}

        ${statCard("👨‍🏫", "Teachers", totalTeachers)}

        ${statCard("💰", "Fees Collected", money(collected))}

        ${statCard("⏳", "Pending Fees", money(pending))}
      </div>

      <div class="quick-grid">

        <div class="quick-card" onclick="navigate('students')">
          👨‍🎓
          <strong>Manage Students</strong>
          <small style="color:#64748b;">Add, edit and view students</small>
        </div>

        <div class="quick-card" onclick="navigate('tests')">
          📝
          <strong>Tests & Results</strong>
          <small style="color:#64748b;">Marks, ranking and results</small>
        </div>

        <div class="quick-card" onclick="navigate('attendance')">
          📅
          <strong>Today's Attendance</strong>
          <small style="color:#64748b;">${att.present} present • ${att.absent} absent</small>
        </div>

        <div class="quick-card" onclick="navigate('fees')">
          💰
          <strong>Fee Management</strong>
          <small style="color:#64748b;">Track pending payments</small>
        </div>

      </div>

      <div class="grid-2">

        <div class="card">
          <div class="card-header">
            <h3>📌 Recent Activity</h3>
          </div>

          <div class="card-body">
            ${
              db.activity.length
              ? db.activity.slice(-7).reverse().map(a => `
                <div class="activity-item">
                  <div class="activity-icon">${a.icon}</div>
                  <div>
                    <div>${esc(a.text)}</div>
                    <small style="color:#94a3b8;">
                      ${formatDate(a.date)}
                    </small>
                  </div>
                </div>
              `).join("")
              : emptyHTML("📌", "No recent activity")
            }
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3>📊 Today's Overview</h3>
          </div>

          <div class="card-body">

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">

              <div class="mini-stat">
                <span style="color:#64748b;">Present</span>
                <strong style="color:#16a34a;">${att.present}</strong>
              </div>

              <div class="mini-stat">
                <span style="color:#64748b;">Absent</span>
                <strong style="color:#dc2626;">${att.absent}</strong>
              </div>

              <div class="mini-stat">
                <span style="color:#64748b;">Late</span>
                <strong style="color:#d97706;">${att.late}</strong>
              </div>

              <div class="mini-stat">
                <span style="color:#64748b;">Not Marked</span>
                <strong>${Math.max(0,totalStudents-att.present-att.absent-att.late)}</strong>
              </div>

            </div>

            <div style="margin-top:18px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:7px;">
                <span>Attendance</span>
                <strong>${percentage(att.percent)}</strong>
              </div>

              <div class="progress">
                <div
                  class="progress-bar"
                  style="width:${Math.min(100,att.percent)}%"
                ></div>
              </div>
            </div>

            <button
              class="btn btn-secondary"
              style="width:100%;margin-top:20px;"
              onclick="navigate('attendance')"
            >
              View Attendance
            </button>

          </div>
        </div>

      </div>
    </div>
  `;
}

function statCard(icon, label, value) {
  return `
    <div class="stat-card">
      <div class="stat-top">
        <span class="stat-label">${label}</span>
        <div class="stat-icon">${icon}</div>
      </div>
      <div class="stat-value">${value}</div>
    </div>
  `;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

/* =========================================================
   STUDENTS
========================================================= */

function renderStudents() {
  if (selectedStudentId) {
    return renderStudentProfile(selectedStudentId);
  }

  let students = db.students.filter(s => s.active !== false);

  if (searchTerm) {
    students = students.filter(s =>
      [s.id,s.name,s.className,s.batch,s.phone]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm)
    );
  }

  return `
    <div class="page">

      <div class="page-header">
        <div>
          <h1 class="page-title">Students</h1>
          <p class="page-subtitle">
            Manage ${db.students.length} student${db.students.length === 1 ? "" : "s"}
          </p>
        </div>

        ${
          currentUser.role === "admin"
          ? `<button class="btn btn-primary" onclick="studentModal()">
               ＋ Add Student
             </button>`
          : ""
        }
      </div>

      <div class="toolbar">

        <div class="search-box">
          <input
            class="input"
            placeholder="🔍 Search by name, ID, class or phone..."
            value="${esc(searchTerm)}"
            oninput="studentSearch(this.value)"
          >
        </div>

        <select
          id="studentClassFilter"
          class="select"
          style="width:180px;"
          onchange="renderStudentFilter()"
        >
          <option value="">All Classes</option>
          ${CLASS_LIST.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join("")}
        </select>

        <select
          id="studentFeeFilter"
          class="select"
          style="width:160px;"
          onchange="renderStudentFilter()"
        >
          <option value="">All Fees</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>

      </div>

      <div class="card">
        <div class="table-wrap">

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Class</th>
                <th>Batch</th>
                <th>Attendance</th>
                <th>Average</th>
                <th>Fees</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody id="studentsTableBody">

              ${
                students.length
                ? students.map(studentRow).join("")
                : `
                  <tr>
                    <td colspan="8">
                      ${emptyHTML("👨‍🎓","No students found")}
                    </td>
                  </tr>
                `
              }

            </tbody>
          </table>

        </div>
      </div>
    </div>
  `;
}

function studentSearch(value) {
  searchTerm = value.toLowerCase();
  renderPage();
}

function renderStudentFilter() {
  const classFilter = document.getElementById("studentClassFilter")?.value || "";
  const feeFilter = document.getElementById("studentFeeFilter")?.value || "";

  let students = db.students.filter(s => s.active !== false);

  if (classFilter) {
    students = students.filter(s => s.className === classFilter);
  }

  if (feeFilter === "paid") {
    students = students.filter(s =>
      Number(s.paidFees || 0) >= Number(s.totalFees || 0)
    );
  }

  if (feeFilter === "pending") {
    students = students.filter(s =>
      Number(s.paidFees || 0) < Number(s.totalFees || 0)
    );
  }

  if (searchTerm) {
    students = students.filter(s =>
      [s.id,s.name,s.className,s.batch,s.phone]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm)
    );
  }

  const body = document.getElementById("studentsTableBody");

  if (body) {
    body.innerHTML = students.length
      ? students.map(studentRow).join("")
      : `<tr><td colspan="8">${emptyHTML("👨‍🎓","No students found")}</td></tr>`;
  }
}

function studentRow(s) {
  const avg = getStudentAverage(s.uid);
  const att = studentAttendancePercentage(s.uid);
  const pending = Math.max(0, Number(s.totalFees || 0) - Number(s.paidFees || 0));

  return `
    <tr>

      <td><strong>${esc(s.id)}</strong></td>

      <td>
        <button
          style="border:none;background:none;color:#2563eb;font-weight:700;"
          onclick="openStudent('${s.uid}')"
        >
          ${esc(s.name)}
        </button>
      </td>

      <td>${esc(s.className)}</td>

      <td>${esc(s.batch || "-")}</td>

      <td>${percentage(att)}</td>

      <td>${avg == null ? "-" : percentage(avg)}</td>

      <td>
        ${
          pending === 0
          ? `<span class="badge badge-success">Paid</span>`
          : `<span class="badge badge-warning">${money(pending)} pending</span>`
        }
      </td>

      <td>
        <div class="actions">

          <button
            class="btn btn-secondary btn-small"
            onclick="openStudent('${s.uid}')"
          >
            View
          </button>

          ${
            currentUser.role === "admin"
            ? `
              <button
                class="btn btn-secondary btn-small"
                onclick="studentModal('${s.uid}')"
              >
                ✏️
              </button>

              <button
                class="btn btn-danger btn-small"
                onclick="deleteStudent('${s.uid}')"
              >
                🗑️
              </button>
            `
            : ""
          }

        </div>
      </td>

    </tr>
  `;
}

function openStudent(uidValue) {
  selectedStudentId = uidValue;
  currentStudentTab = "overview";
  renderPage();
}

function renderStudentProfile(uidValue) {
  const s = db.students.find(x => x.uid === uidValue);

  if (!s) {
    selectedStudentId = null;
    return renderStudents();
  }

  const avg = getStudentAverage(s.uid);
  const att = studentAttendancePercentage(s.uid);
  const pending = Math.max(0, Number(s.totalFees || 0) - Number(s.paidFees || 0));

  return `
    <div class="page">

      <div class="page-header">
        <div>
          <button
            class="btn btn-secondary btn-small"
            onclick="selectedStudentId=null;renderPage()"
          >
            ← Back to Students
          </button>
        </div>

        ${
          currentUser.role === "admin"
          ? `<button class="btn btn-primary" onclick="studentModal('${s.uid}')">
               ✏️ Edit Student
             </button>`
          : ""
        }
      </div>

      <div class="card">

        <div class="profile-head">

          <div class="profile-avatar">👨‍🎓</div>

          <div style="flex:1;">
            <div class="profile-name">${esc(s.name)}</div>

            <div class="profile-meta">
              ${esc(s.id)} • ${esc(s.className)} • ${esc(s.batch || "No batch")}
            </div>
          </div>

          <span class="badge ${s.active !== false ? "badge-success" : "badge-gray"}">
            ${s.active !== false ? "Active" : "Inactive"}
          </span>

        </div>

        <div class="stats-grid" style="padding:0 20px;">

          ${statCard("📅","Attendance",percentage(att))}

          ${statCard("📈","Average",avg == null ? "-" : percentage(avg))}

          ${statCard("💰","Paid",money(s.paidFees))}

          ${statCard("⏳","Pending",money(pending))}

        </div>

        <div class="tabs">

          ${studentTab("overview","Overview")}
          ${studentTab("attendance","Attendance")}
          ${studentTab("tests","Tests")}
          ${studentTab("fees","Fees")}
          ${studentTab("homework","Homework")}

        </div>

        <div class="card-body">
          ${studentTabContent(s)}
        </div>

      </div>
    </div>
  `;
}

function studentTab(tab, label) {
  return `
    <button
      class="tab ${currentStudentTab === tab ? "active" : ""}"
      onclick="currentStudentTab='${tab}';renderPage()"
    >
      ${label}
    </button>
  `;
}

function studentTabContent(s) {
  if (currentStudentTab === "overview") {
    return `
      <div class="form-grid">

        <div>
          <strong>Student ID</strong>
          <p style="color:#64748b;margin-top:5px;">${esc(s.id)}</p>
        </div>

        <div>
          <strong>Class</strong>
          <p style="color:#64748b;margin-top:5px;">${esc(s.className)}</p>
        </div>

        <div>
          <strong>Batch</strong>
          <p style="color:#64748b;margin-top:5px;">${esc(s.batch || "-")}</p>
        </div>

        <div>
          <strong>Phone</strong>
          <p style="color:#64748b;margin-top:5px;">${esc(s.phone || "-")}</p>
        </div>

        <div>
          <strong>Guardian</strong>
          <p style="color:#64748b;margin-top:5px;">${esc(s.guardian || "-")}</p>
        </div>

        <div>
          <strong>Guardian Phone</strong>
          <p style="color:#64748b;margin-top:5px;">${esc(s.guardianPhone || "-")}</p>
        </div>

      </div>
    `;
  }

  if (currentStudentTab === "attendance") {
    const records = [];

    Object.entries(db.attendance).forEach(([date, map]) => {
      if (map[s.uid]) {
        records.push({
          date,
          status: map[s.uid]
        });
      }
    });

    records.sort((a,b) => b.date.localeCompare(a.date));

    return records.length
      ? `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${records.map(r => `
                <tr>
                  <td>${formatDate(r.date)}</td>
                  <td>${statusBadge(r.status)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `
      : emptyHTML("📅","No attendance records yet");
  }

  if (currentStudentTab === "tests") {
    const tests = db.tests.map(test => {
      const result = test.results?.[s.uid];
      return {test,result};
    }).filter(x => x.result && x.result.present && x.result.marks !== "");

    return tests.length
      ? `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Test</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Marks</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${tests.map(x => `
                <tr>
                  <td>${esc(x.test.name)}</td>
                  <td>${esc(x.test.subject)}</td>
                  <td>${formatDate(x.test.date)}</td>
                  <td>${x.result.marks}/${x.test.total}</td>
                  <td>${percentage((x.result.marks/x.test.total)*100)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `
      : emptyHTML("📝","No test results yet");
  }

  if (currentStudentTab === "fees") {
    const payments = db.payments.filter(p => p.studentUid === s.uid);

    return `
      <div class="stats-grid">

        ${statCard("💰","Total Fee",money(s.totalFees))}
        ${statCard("✅","Paid",money(s.paidFees))}
        ${statCard("⏳","Pending",money(Math.max(0,s.totalFees-s.paidFees)))}
        ${statCard("🧾","Payments",payments.length)}

      </div>

      ${
        payments.length
        ? `
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Note</th>
                </tr>
              </thead>

              <tbody>
                ${payments.map(p => `
                  <tr>
                    <td>${formatDate(p.date)}</td>
                    <td>${esc(p.month || "-")}</td>
                    <td>${money(p.amount)}</td>
                    <td>${esc(p.method)}</td>
                    <td>${esc(p.note || "-")}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `
        : emptyHTML("💰","No payment records")
      }
    `;
  }

  if (currentStudentTab === "homework") {
    const homework = db.homework.filter(
      h => h.className === s.className
    );

    return homework.length
      ? `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Homework</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${homework.map(h => `
                <tr>
                  <td>${esc(h.subject)}</td>
                  <td>${esc(h.title)}</td>
                  <td>${formatDate(h.dueDate)}</td>
                  <td>
                    ${new Date(h.dueDate) < new Date()
                      ? `<span class="badge badge-danger">Due</span>`
                      : `<span class="badge badge-success">Active</span>`}
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `
      : emptyHTML("📚","No homework for this class");
  }
}

function studentModal(studentUid = null) {
  if (currentUser.role !== "admin") return;

  const s = studentUid
    ? db.students.find(x => x.uid === studentUid)
    : null;

  showModal(
    s ? "Edit Student" : "Add Student",
    `
      <form id="studentForm">

        <input type="hidden" name="uid" value="${s?.uid || ""}">

        <div class="form-grid">

          <div class="form-group">
            <label class="form-label">Student ID</label>
            <input
              class="input"
              name="id"
              required
              value="${esc(s?.id || nextStudentId())}"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Student Name</label>
            <input
              class="input"
              name="name"
              required
              value="${esc(s?.name || "")}"
              placeholder="Full name"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Class</label>
            <select class="select" name="className" required>
              ${CLASS_LIST.map(c => `
                <option ${s?.className === c ? "selected" : ""}>
                  ${esc(c)}
                </option>
              `).join("")}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Batch</label>
            <input
              class="input"
              name="batch"
              value="${esc(s?.batch || "")}"
              placeholder="Morning / Evening"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Student Phone</label>
            <input
              class="input"
              name="phone"
              value="${esc(s?.phone || "")}"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Guardian Name</label>
            <input
              class="input"
              name="guardian"
              value="${esc(s?.guardian || "")}"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Guardian Phone</label>
            <input
              class="input"
              name="guardianPhone"
              value="${esc(s?.guardianPhone || "")}"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Admission Date</label>
            <input
              type="date"
              class="input"
              name="admissionDate"
              value="${s?.admissionDate || today()}"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Total Fee</label>
            <input
              type="number"
              min="0"
              class="input"
              name="totalFees"
              value="${s?.totalFees ?? 0}"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Already Paid</label>
            <input
              type="number"
              min="0"
              class="input"
              name="paidFees"
              value="${s?.paidFees ?? 0}"
            >
          </div>

        </div>

        <div class="modal-footer" style="margin:0 -22px -22px;">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">
            Cancel
          </button>

          <button class="btn btn-primary">
            💾 Save Student
          </button>
        </div>

      </form>
    `,
    false
  );

  document.getElementById("studentForm").onsubmit = saveStudent;
}

function saveStudent(event) {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(event.target).entries());

  const existing = data.uid
    ? db.students.find(s => s.uid === data.uid)
    : null;

  const student = {
    uid: data.uid || uid("STU"),
    id: data.id.trim(),
    name: data.name.trim(),
    className: data.className,
    batch: data.batch.trim(),
    phone: data.phone.trim(),
    guardian: data.guardian.trim(),
    guardianPhone: data.guardianPhone.trim(),
    admissionDate: data.admissionDate,
    totalFees: Number(data.totalFees || 0),
    paidFees: Number(data.paidFees || 0),
    active: existing ? existing.active : true
  };

  if (!student.name) {
    showToast("Student name is required", "error");
    return;
  }

  if (existing) {
    Object.assign(existing, student);
    addActivity("✏️", `${student.name}'s student record was updated.`);
  } else {
    db.students.push(student);
    addActivity("👨‍🎓", `${student.name} was added as a student.`);
  }

  saveDB();
  closeModal();
  renderPage();
  showToast("Student saved successfully", "success");
}

function nextStudentId() {
  const nums = db.students
    .map(s => Number(String(s.id).replace(/\D/g,"")))
    .filter(Boolean);

  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return "ST" + String(next).padStart(3,"0");
}

function deleteStudent(studentUid) {
  if (currentUser.role !== "admin") return;

  const s = db.students.find(x => x.uid === studentUid);
  if (!s) return;

  if (!confirm(`Delete ${s.name}? This will remove the student from active records.`)) {
    return;
  }

  s.active = false;
  addActivity("🗑️", `${s.name} was removed from active students.`);
  saveDB();
  renderPage();
  showToast("Student removed", "success");
}

/* =========================================================
   TEACHERS
========================================================= */

function renderTeachers() {
  let teachers = db.teachers.filter(t => t.active !== false);

  if (searchTerm) {
    teachers = teachers.filter(t =>
      [t.id,t.name,t.phone,...t.subjects,...t.classes]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm)
    );
  }

  return `
    <div class="page">

      <div class="page-header">
        <div>
          <h1 class="page-title">Teachers</h1>
          <p class="page-subtitle">Manage teaching staff and assignments</p>
        </div>

        ${
          currentUser.role === "admin"
          ? `<button class="btn btn-primary" onclick="teacherModal()">
               ＋ Add Teacher
             </button>`
          : ""
        }
      </div>

      <div class="toolbar">
        <div class="search-box">
          <input
            class="input"
            placeholder="🔍 Search teachers..."
            value="${esc(searchTerm)}"
            oninput="teacherSearch(this.value)"
          >
        </div>
      </div>

      <div class="card">
        <div class="table-wrap">
          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Subjects</th>
                <th>Classes</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              ${
                teachers.length
                ? teachers.map(t => `
                  <tr>

                    <td><strong>${esc(t.id)}</strong></td>

                    <td>${esc(t.name)}</td>

                    <td>${t.subjects.map(x =>
                      `<span class="badge badge-info" style="margin:2px;">${esc(x)}</span>`
                    ).join("")}</td>

                    <td>${t.classes.map(x =>
                      `<span class="badge badge-gray" style="margin:2px;">${esc(x)}</span>`
                    ).join("")}</td>

                    <td>${esc(t.phone || "-")}</td>

                    <td>
                      <div class="actions">

                        ${
                          currentUser.role === "admin"
                          ? `
                            <button
                              class="btn btn-secondary btn-small"
                              onclick="teacherModal('${t.uid}')"
                            >
                              ✏️ Edit
                            </button>

                            <button
                              class="btn btn-danger btn-small"
                              onclick="deleteTeacher('${t.uid}')"
                            >
                              🗑️
                            </button>
                          `
                          : `
                            <span class="badge badge-success">Assigned</span>
                          `
                        }

                      </div>
                    </td>

                  </tr>
                `).join("")
                : `<tr><td colspan="6">${emptyHTML("👨‍🏫","No teachers found")}</td></tr>`
              }

            </tbody>

          </table>
        </div>
      </div>
    </div>
  `;
}

function teacherSearch(value) {
  searchTerm = value.toLowerCase();
  renderPage();
}

function teacherModal(teacherUid = null) {
  if (currentUser.role !== "admin") return;

  const t = teacherUid
    ? db.teachers.find(x => x.uid === teacherUid)
    : null;

  showModal(
    t ? "Edit Teacher" : "Add Teacher",
    `
      <form id="teacherForm">

        <input type="hidden" name="uid" value="${t?.uid || ""}">

        <div class="form-grid">

          <div class="form-group">
            <label class="form-label">Teacher ID</label>
            <input
              class="input"
              name="id"
              required
              value="${esc(t?.id || nextTeacherId())}"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Teacher Name</label>
            <input
              class="input"
              name="name"
              required
              value="${esc(t?.name || "")}"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Subjects</label>
            <select class="select" name="subjects" multiple style="height:130px;">
              ${SUBJECTS.map(s => `
                <option
                  value="${esc(s)}"
                  ${t?.subjects?.includes(s) ? "selected" : ""}
                >
                  ${esc(s)}
                </option>
              `).join("")}
            </select>
            <small style="color:#64748b;">
              Hold Ctrl to select multiple subjects.
            </small>
          </div>

          <div class="form-group">
            <label class="form-label">Classes</label>
            <select class="select" name="classes" multiple style="height:180px;">
              ${CLASS_LIST.map(c => `
                <option
                  value="${esc(c)}"
                  ${t?.classes?.includes(c) ? "selected" : ""}
                >
                  ${esc(c)}
                </option>
              `).join("")}
            </select>
            <small style="color:#64748b;">
              Hold Ctrl to select multiple classes.
            </small>
          </div>

          <div class="form-group">
            <label class="form-label">Phone</label>
            <input
              class="input"
              name="phone"
              value="${esc(t?.phone || "")}"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <input
              type="email"
              class="input"
              name="email"
              value="${esc(t?.email || "")}"
            >
          </div>

        </div>

        <div class="modal-footer" style="margin:0 -22px -22px;">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">
            Cancel
          </button>

          <button class="btn btn-primary">
            💾 Save Teacher
          </button>
        </div>

      </form>
    `,
    false
  );

  document.getElementById("teacherForm").onsubmit = saveTeacher;
}

function saveTeacher(event) {
  event.preventDefault();

  const form = event.target;

  const selectedSubjects =
    [...form.querySelector('[name="subjects"]').selectedOptions]
      .map(x => x.value);

  const selectedClasses =
    [...form.querySelector('[name="classes"]').selectedOptions]
      .map(x => x.value);

  const uidValue = form.uid.value;

  const existing = uidValue
    ? db.teachers.find(t => t.uid === uidValue)
    : null;

  const teacher = {
    uid: uidValue || uid("TEA"),
    id: form.id.value.trim(),
    name: form.name.value.trim(),
    subjects: selectedSubjects,
    classes: selectedClasses,
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    active: existing ? existing.active : true
  };

  if (!teacher.name) {
    showToast("Teacher name is required", "error");
    return;
  }

  if (existing) {
    Object.assign(existing, teacher);
    addActivity("✏️", `${teacher.name}'s teacher record was updated.`);
  } else {
    db.teachers.push(teacher);
    addActivity("👨‍🏫", `${teacher.name} was added as a teacher.`);
  }

  saveDB();
  closeModal();
  renderPage();

  showToast("Teacher saved successfully", "success");
}

function nextTeacherId() {
  const nums = db.teachers
    .map(t => Number(String(t.id).replace(/\D/g,"")))
    .filter(Boolean);

  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return "T" + String(next).padStart(3,"0");
}

function deleteTeacher(teacherUid) {
  const t = db.teachers.find(x => x.uid === teacherUid);
  if (!t) return;

  if (!confirm(`Remove teacher ${t.name}?`)) return;

  t.active = false;
  addActivity("🗑️", `${t.name} was removed from teachers.`);
  saveDB();
  renderPage();
  showToast("Teacher removed", "success");
}

/* =========================================================
   CLASSES
========================================================= */

function renderClasses() {
  return `
    <div class="page">

      <div class="page-header">
        <div>
          <h1 class="page-title">Classes</h1>
          <p class="page-subtitle">
            Nursery through Class 9
          </p>
        </div>
      </div>

      <div class="class-grid">

        ${CLASS_LIST.map(c => {

          const students = db.students.filter(
            s => s.active !== false && s.className === c
          );

          const teachers = db.teachers.filter(
            t => t.active !== false && t.classes.includes(c)
          );

          const tests = db.tests.filter(
            t => t.className === c
          );

          return `
            <div class="class-card" onclick="classDetails('${esc(c)}')">

              <div class="class-icon">🏫</div>

              <h3>${esc(c)}</h3>

              <p>
                👨‍🎓 ${students.length} students
              </p>

              <p>
                👨‍🏫 ${teachers.length} teachers
              </p>

              <p>
                📝 ${tests.length} tests
              </p>

            </div>
          `;
        }).join("")}

      </div>
    </div>
  `;
}

function classDetails(className) {
  showModal(
    className,
    `
      <div class="stats-grid">

        ${statCard(
          "👨‍🎓",
          "Students",
          db.students.filter(s => s.className === className && s.active !== false).length
        )}

        ${statCard(
          "👨‍🏫",
          "Teachers",
          db.teachers.filter(t => t.classes.includes(className) && t.active !== false).length
        )}

        ${statCard(
          "📝",
          "Tests",
          db.tests.filter(t => t.className === className).length
        )}

        ${statCard(
          "📚",
          "Homework",
          db.homework.filter(h => h.className === className).length
        )}

      </div>

      <h3 style="margin:20px 0 10px;">Students</h3>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Average</th>
              <th>Attendance</th>
            </tr>
          </thead>

          <tbody>
            ${
              db.students
                .filter(s => s.className === className && s.active !== false)
                .map(s => `
                  <tr>
                    <td>${esc(s.id)}</td>
                    <td>${esc(s.name)}</td>
                    <td>${getStudentAverage(s.uid) == null ? "-" : percentage(getStudentAverage(s.uid))}</td>
                    <td>${percentage(studentAttendancePercentage(s.uid))}</td>
                  </tr>
                `).join("")
                || `<tr><td colspan="4">${emptyHTML("👨‍🎓","No students")}</td></tr>`
            }
          </tbody>
        </table>
      </div>
    `,
    true
  );
}

/* =========================================================
   TESTS
========================================================= */

function renderTests() {
  if (selectedTestId) {
    return renderTestDetails(selectedTestId);
  }

  let tests = [...db.tests];

  if (searchTerm) {
    tests = tests.filter(t =>
      [t.id,t.name,t.subject,t.className]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm)
    );
  }

  tests.sort((a,b) => b.date.localeCompare(a.date));

  return `
    <div class="page">

      <div class="page-header">
        <div>
          <h1 class="page-title">Tests & Results</h1>
          <p class="page-subtitle">
            Create tests, enter marks, attendance and automatic ranking
          </p>
        </div>

        ${
          currentUser.role !== "student"
          ? `<button class="btn btn-primary" onclick="testModal()">
               ＋ Create Test
             </button>`
          : ""
        }
      </div>

      <div class="toolbar">
        <div class="search-box">
          <input
            class="input"
            placeholder="🔍 Search tests..."
            value="${esc(searchTerm)}"
            oninput="testSearch(this.value)"
          >
        </div>

        <select class="select" id="testClassFilter" style="width:180px;" onchange="testFilter()">
          <option value="">All Classes</option>
          ${CLASS_LIST.map(c => `<option>${esc(c)}</option>`).join("")}
        </select>

        <select class="select" id="testSubjectFilter" style="width:180px;" onchange="testFilter()">
          <option value="">All Subjects</option>
          ${SUBJECTS.map(s => `<option>${esc(s)}</option>`).join("")}
        </select>
      </div>

      <div class="card">

        <div class="table-wrap">

          <table>

            <thead>
              <tr>
                <th>Test</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Total Marks</th>
                <th>Students</th>
                <th>Average</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody id="testsBody">

              ${
                tests.length
                ? tests.map(testRow).join("")
                : `<tr><td colspan="8">${emptyHTML("📝","No tests found")}</td></tr>`
              }

            </tbody>

          </table>

        </div>
      </div>

    </div>
  `;
}

function testRow(t) {
  const stats = testStats(t);

  return `
    <tr>

      <td>
        <button
          style="border:none;background:none;color:#2563eb;font-weight:700;text-align:left;"
          onclick="openTest('${t.id}')"
        >
          ${esc(t.name)}
        </button>
      </td>

      <td>${esc(t.className)}</td>
      <td>${esc(t.subject)}</td>
      <td>${formatDate(t.date)}</td>
      <td>${t.total}</td>
      <td>${stats.present}/${stats.total}</td>
      <td>${stats.average == null ? "-" : percentage(stats.average)}</td>

      <td>
        <div class="actions">

          <button
            class="btn btn-primary btn-small"
            onclick="openTest('${t.id}')"
          >
            Results
          </button>

          ${
            currentUser.role !== "student"
            ? `
              <button
                class="btn btn-secondary btn-small"
                onclick="testModal('${t.id}')"
              >
                ✏️
              </button>

              <button
                class="btn btn-danger btn-small"
                onclick="deleteTest('${t.id}')"
              >
                🗑️
              </button>
            `
            : ""
          }

        </div>
      </td>

    </tr>
  `;
}

function testSearch(value) {
  searchTerm = value.toLowerCase();
  renderPage();
}

function testFilter() {
  const classFilter = document.getElementById("testClassFilter")?.value || "";
  const subjectFilter = document.getElementById("testSubjectFilter")?.value || "";

  let tests = db.tests;

  if (classFilter) tests = tests.filter(t => t.className === classFilter);
  if (subjectFilter) tests = tests.filter(t => t.subject === subjectFilter);

  if (searchTerm) {
    tests = tests.filter(t =>
      [t.name,t.subject,t.className,t.id]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm)
    );
  }

  const body = document.getElementById("testsBody");

  if (body) {
    body.innerHTML = tests.length
      ? tests.map(testRow).join("")
      : `<tr><td colspan="8">${emptyHTML("📝","No tests found")}</td></tr>`;
  }
}

function testModal(testId = null) {
  if (currentUser.role === "student") return;

  const t = testId
    ? db.tests.find(x => x.id === testId)
    : null;

  showModal(
    t ? "Edit Test" : "Create Test",
    `
      <form id="testForm">

        <input type="hidden" name="id" value="${t?.id || ""}">

        <div class="form-grid">

          <div class="form-group">
            <label class="form-label">Test Name</label>
            <input
              class="input"
              name="name"
              required
              value="${esc(t?.name || "")}"
              placeholder="Monthly Science Test"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Subject</label>
            <select class="select" name="subject">
              ${SUBJECTS.map(s => `
                <option ${t?.subject === s ? "selected" : ""}>
                  ${esc(s)}
                </option>
              `).join("")}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Class</label>
            <select class="select" name="className">
              ${CLASS_LIST.map(c => `
                <option ${t?.className === c ? "selected" : ""}>
                  ${esc(c)}
                </option>
              `).join("")}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Test Date</label>
            <input
              type="date"
              class="input"
              name="date"
              value="${t?.date || today()}"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Total Marks</label>
            <input
              type="number"
              min="1"
              class="input"
              name="total"
              value="${t?.total || 100}"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Question Paper</label>
            <input
              type="file"
              class="input"
              id="questionPaperFile"
              accept=".pdf,image/*"
            >
            ${
              t?.questionPaper
              ? `<small>Existing file attached. Selecting a new file replaces it.</small>`
              : ""
            }
          </div>

          <div class="form-group">
            <label class="form-label">Solution</label>
            <input
              type="file"
              class="input"
              id="solutionFile"
              accept=".pdf,image/*"
            >
            ${
              t?.solution
              ? `<small>Existing file attached. Selecting a new file replaces it.</small>`
              : ""
            }
          </div>

        </div>

        <div style="background:#eff6ff;padding:13px;border-radius:10px;color:#1e40af;font-size:13px;">
          📌 Files are stored in this browser in the current prototype.
          Keep files reasonably small. Cloud storage can be connected later.
        </div>

        <div class="modal-footer" style="margin:18px -22px -22px;">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">
            Cancel
          </button>

          <button class="btn btn-primary">
            💾 Save Test
          </button>
        </div>

      </form>
    `,
    false
  );

  document.getElementById("testForm").onsubmit = e =>
    saveTest(e, t);
}

async function saveTest(event, existing) {
  event.preventDefault();

  const form = event.target;

  const questionFile =
    document.getElementById("questionPaperFile").files[0];

  const solutionFile =
    document.getElementById("solutionFile").files[0];

  const questionPaper = questionFile
    ? await fileToDataURL(questionFile)
    : existing?.questionPaper || "";

  const solution = solutionFile
    ? await fileToDataURL(solutionFile)
    : existing?.solution || "";

  const test = {
    id: form.id.value || nextTestId(),
    name: form.name.value.trim(),
    subject: form.subject.value,
    className: form.className.value,
    date: form.date.value,
    total: Number(form.total.value || 100),
    questionPaper,
    solution,
    results: existing?.results || {}
  };

  if (!test.name) {
    showToast("Test name is required", "error");
    return;
  }

  if (existing) {
    Object.assign(existing, test);
    addActivity("✏️", `${test.name} was updated.`);
  } else {
    db.tests.push(test);
    addActivity("📝", `${test.name} was created.`);
  }

  saveDB();
  closeModal();
  renderPage();
  showToast("Test saved successfully", "success");
}

function nextTestId() {
  const nums = db.tests
    .map(t => Number(String(t.id).replace(/\D/g,"")))
    .filter(Boolean);

  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return "TEST" + String(next).padStart(3,"0");
}

function deleteTest(testId) {
  const t = db.tests.find(x => x.id === testId);
  if (!t) return;

  if (!confirm(`Delete test "${t.name}" and its results?`)) return;

  db.tests = db.tests.filter(x => x.id !== testId);
  addActivity("🗑️", `${t.name} was deleted.`);
  saveDB();
  renderPage();
  showToast("Test deleted", "success");
}

function openTest(testId) {
  selectedTestId = testId;
  renderPage();
}

function renderTestDetails(testId) {
  const t = db.tests.find(x => x.id === testId);

  if (!t) {
    selectedTestId = null;
    return renderTests();
  }

  const students = db.students.filter(
    s => s.active !== false && s.className === t.className
  );

  const stats = testStats(t);

  return `
    <div class="page">

      <div class="page-header">

        <div>
          <button
            class="btn btn-secondary btn-small"
            onclick="selectedTestId=null;renderPage()"
          >
            ← Back to Tests
          </button>
        </div>

        ${
          currentUser.role !== "student"
          ? `
            <div class="actions">
              <button
                class="btn btn-secondary"
                onclick="testModal('${t.id}')"
              >
                ✏️ Edit Test
              </button>
            </div>
          `
          : ""
        }

      </div>

      <div class="card">

        <div class="test-header">

          <div class="test-title">${esc(t.name)}</div>

          <div class="test-meta">
            ${esc(t.className)} • ${esc(t.subject)} • ${formatDate(t.date)}
            • Maximum Marks: ${t.total}
          </div>

          <div class="test-stats">

            ${miniStat("👨‍🎓","Students",stats.total)}

            ${miniStat("✅","Present",stats.present)}

            ${miniStat("✏️","Marks Entered",stats.entered)}

            ${miniStat("📊","Test Average",
              stats.average == null ? "-" : percentage(stats.average)
            )}

          </div>

          <div class="actions">

            ${
              t.questionPaper
              ? `<button class="btn btn-secondary" onclick="openAttachment('${t.id}','question')">
                   📄 Question Paper
                 </button>`
              : ""
            }

            ${
              t.solution
              ? `<button class="btn btn-secondary" onclick="openAttachment('${t.id}','solution')">
                   📄 Solution
                 </button>`
              : ""
            }

          </div>

        </div>

        ${
          currentUser.role === "student"
          ? renderStudentTestView(t)
          : renderMarksEntry(t, students)
        }

      </div>

    </div>
  `;
}

function miniStat(label, value, small = false) {
  return `
    <div class="mini-stat">
      <span style="color:#64748b;font-size:12px;">${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function renderMarksEntry(t, students) {
  return `
    <div class="card-body">

      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:15px;flex-wrap:wrap;">

        <div>
          <h3>Student Results</h3>
          <p style="color:#64748b;font-size:13px;margin-top:4px;">
            Mark each student's test attendance and enter marks.
          </p>
        </div>

        <button
          class="btn btn-success"
          onclick="markAllTestPresent('${t.id}')"
        >
          ✓ Mark All Present
        </button>

      </div>

      <div class="table-wrap">

        <table>

          <thead>
            <tr>
              <th>Rank</th>
              <th>Student</th>
              <th>Class</th>
              <th>Test Attendance</th>
              <th>Marks / ${t.total}</th>
              <th>Percentage</th>
              <th>Average</th>
            </tr>
          </thead>

          <tbody>

            ${
              students.length
              ? students.map((s,index) =>
                resultRow(t,s,index)
              ).join("")
              : `<tr><td colspan="7">${emptyHTML("👨‍🎓","No students in this class")}</td></tr>`
            }

          </tbody>

        </table>

      </div>

      <div style="margin-top:18px;text-align:right;">
        <button
          class="btn btn-primary"
          onclick="saveAllResults('${t.id}')"
        >
          💾 Save All Results
        </button>
      </div>

    </div>
  `;
}

function resultRow(t,s,index) {
  const r = t.results?.[s.uid] || {
    present: true,
    marks: ""
  };

  const avg = getStudentAverage(s.uid);

  return `
    <tr>

      <td>
        <strong>${rankForStudent(s.uid)}</strong>
      </td>

      <td>
        <strong>${esc(s.name)}</strong>
        <br>
        <small style="color:#94a3b8;">${esc(s.id)}</small>
      </td>

      <td>${esc(s.className)}</td>

      <td>

        <div class="attendance-buttons">

          <button
            type="button"
            class="att-btn att-present ${r.present ? "selected" : ""}"
            onclick="setTestPresence('${t.id}','${s.uid}',true)"
          >
            Present
          </button>

          <button
            type="button"
            class="att-btn att-absent ${!r.present ? "selected" : ""}"
            onclick="setTestPresence('${t.id}','${s.uid}',false)"
          >
            Absent
          </button>

        </div>

      </td>

      <td>
        <input
          type="number"
          min="0"
          max="${t.total}"
          step="0.01"
          class="input"
          style="width:120px;"
          id="marks_${t.id}_${s.uid}"
          value="${r.marks ?? ""}"
          ${!r.present ? "disabled" : ""}
          onchange="temporaryMark('${t.id}','${s.uid}',this.value)"
        >
      </td>

      <td id="percent_${t.id}_${s.uid}">
        ${
          r.present && r.marks !== "" && r.marks != null
          ? percentage((Number(r.marks)/t.total)*100)
          : "-"
        }
      </td>

      <td>
        ${avg == null ? "-" : percentage(avg)}
      </td>

    </tr>
  `;
}

function temporaryMark(testId,studentUid,value) {
  const t = db.tests.find(x => x.id === testId);
  if (!t) return;

  t.results ||= {};
  t.results[studentUid] ||= {present:true,marks:""};

  if (value === "") {
    t.results[studentUid].marks = "";
  } else {
    const n = Number(value);

    if (n < 0 || n > t.total) {
      showToast(`Marks must be between 0 and ${t.total}`, "error");
      return;
    }

    t.results[studentUid].marks = n;
  }

  const cell = document.getElementById(
    `percent_${testId}_${studentUid}`
  );

  if (cell) {
    const r = t.results[studentUid];

    cell.textContent =
      r.present && r.marks !== ""
      ? percentage((Number(r.marks)/t.total)*100)
      : "-";
  }
}

function setTestPresence(testId, studentUid, present) {
  const t = db.tests.find(x => x.id === testId);
  if (!t) return;

  t.results ||= {};
  t.results[studentUid] ||= {};

  t.results[studentUid].present = present;

  if (!present) {
    t.results[studentUid].marks = "";
  }

  saveDB();
  renderPage();
}

function markAllTestPresent(testId) {
  const t = db.tests.find(x => x.id === testId);
  if (!t) return;

  db.students
    .filter(s => s.className === t.className && s.active !== false)
    .forEach(s => {
      t.results ||= {};
      t.results[s.uid] ||= {};
      t.results[s.uid].present = true;
    });

  saveDB();
  renderPage();
  showToast("All students marked present", "success");
}

function saveAllResults(testId) {
  const t = db.tests.find(x => x.id === testId);
  if (!t) return;

  t.results ||= {};

  db.students
    .filter(s => s.className === t.className && s.active !== false)
    .forEach(s => {
      const input = document.getElementById(
        `marks_${t.id}_${s.uid}`
      );

      if (!input) return;

      const r = t.results[s.uid] ||= {
        present: true,
        marks: ""
      };

      if (!r.present) {
        r.marks = "";
        return;
      }

      if (input.value === "") {
        r.marks = "";
      } else {
        const n = Number(input.value);

        if (n < 0 || n > t.total) {
          showToast(`${s.name}: invalid marks`, "error");
          return;
        }

        r.marks = n;
      }
    });

  saveDB();
  addActivity("📊", `${t.name} results were updated.`);
  renderPage();

  showToast("Results saved successfully", "success");
}

function renderStudentTestView(t) {
  const s = db.students.find(
    x => x.name === currentUser.name
  );

  if (!s) {
    return `
      <div class="card-body">
        ${emptyHTML("📝","No student profile linked to this login")}
      </div>
    `;
  }

  const r = t.results?.[s.uid];

  return `
    <div class="card-body">

      ${
        !r
        ? emptyHTML("📝","Result has not been entered yet")
        : `
          <div class="stats-grid">

            ${statCard(
              "📅",
              "Attendance",
              r.present ? "Present" : "Absent"
            )}

            ${statCard(
              "📊",
              "Marks",
              r.present && r.marks !== "" ? `${r.marks}/${t.total}` : "-"
            )}

            ${statCard(
              "📈",
              "Percentage",
              r.present && r.marks !== ""
                ? percentage((r.marks/t.total)*100)
                : "-"
            )}

            ${statCard(
              "🏆",
              "Overall Average",
              getStudentAverage(s.uid) == null
                ? "-"
                : percentage(getStudentAverage(s.uid))
            )}

          </div>
        `
      }

    </div>
  `;
}

function testStats(t) {
  const students = db.students.filter(
    s => s.active !== false && s.className === t.className
  );

  let present = 0;
  let entered = 0;
  let totalPercentage = 0;

  students.forEach(s => {
    const r = t.results?.[s.uid];

    if (r?.present) {
      present++;

      if (r.marks !== "" && r.marks != null) {
        entered++;
        totalPercentage += (Number(r.marks)/t.total)*100;
      }
    }
  });

  return {
    total: students.length,
    present,
    entered,
    average: entered ? totalPercentage/entered : null
  };
}

function getStudentAverage(studentUid) {
  const percentages = [];

  db.tests.forEach(t => {
    const r = t.results?.[studentUid];

    if (
      r &&
      r.present &&
      r.marks !== "" &&
      r.marks != null &&
      Number(t.total) > 0
    ) {
      percentages.push((Number(r.marks)/Number(t.total))*100);
    }
  });

  if (!percentages.length) return null;

  return percentages.reduce((a,b) => a+b,0) / percentages.length;
}

function rankForStudent(studentUid) {
  const student = db.students.find(s => s.uid === studentUid);

  if (!student) return "-";

  const sameClass = db.students
    .filter(s =>
      s.active !== false &&
      s.className === student.className
    )
    .map(s => ({
      uid: s.uid,
      avg: getStudentAverage(s.uid)
    }))
    .filter(x => x.avg != null)
    .sort((a,b) => b.avg - a.avg);

  const index = sameClass.findIndex(x => x.uid === studentUid);

  return index === -1 ? "-" : index + 1;
}

/* =========================================================
   ATTENDANCE
========================================================= */

let attendanceDate = today();
let attendanceClass = "";

function renderAttendance() {
  const students = db.students.filter(
    s => s.active !== false &&
    (!attendanceClass || s.className === attendanceClass)
  );

  const records = db.attendance[attendanceDate] || {};

  return `
    <div class="page">

      <div class="page-header">
        <div>
          <h1 class="page-title">Attendance</h1>
          <p class="page-subtitle">
            Daily student attendance
          </p>
        </div>
      </div>

      <div class="toolbar">

        <input
          type="date"
          class="input"
          style="width:180px;"
          value="${attendanceDate}"
          onchange="attendanceDate=this.value;renderPage()"
        >

        <select
          class="select"
          style="width:180px;"
          onchange="attendanceClass=this.value;renderPage()"
        >
          <option value="">All Classes</option>
          ${CLASS_LIST.map(c => `
            <option
              value="${esc(c)}"
              ${attendanceClass === c ? "selected" : ""}
            >
              ${esc(c)}
            </option>
          `).join("")}
        </select>

        ${
          currentUser.role !== "student"
          ? `
            <button
              class="btn btn-success"
              onclick="markAllAttendance('Present')"
            >
              ✓ Mark All Present
            </button>
          `
          : ""
        }

      </div>

      <div class="card">

        ${
          currentUser.role === "student"
          ? renderStudentAttendance()
          : `
            <div class="table-wrap">

              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  ${
                    students.length
                    ? students.map(s => {
                      const status = records[s.uid] || "Not Marked";

                      return `
                        <tr>

                          <td>${esc(s.id)}</td>

                          <td>
                            <strong>${esc(s.name)}</strong>
                          </td>

                          <td>${esc(s.className)}</td>

                          <td>

                            <div class="attendance-buttons">

                              ${attendanceButton(
                                s.uid,
                                "Present",
                                status
                              )}

                              ${attendanceButton(
                                s.uid,
                                "Absent",
                                status
                              )}

                              ${attendanceButton(
                                s.uid,
                                "Late",
                                status
                              )}

                            </div>

                          </td>

                        </tr>
                      `;
                    }).join("")
                    : `<tr><td colspan="4">${emptyHTML("📅","No students")}</td></tr>`
                  }

                </tbody>

              </table>

            </div>

            <div style="padding:17px;text-align:right;border-top:1px solid #e2e8f0;">

              <button
                class="btn btn-primary"
                onclick="saveAttendance()"
              >
                💾 Save Attendance
              </button>

            </div>
          `
        }

      </div>

      <div class="card" style="margin-top:20px;">
        <div class="card-header">
          <h3>📊 Attendance Summary</h3>
        </div>
        <div class="card-body">
          ${attendanceReportTable()}
        </div>
      </div>

    </div>
  `;
}

function attendanceButton(uidValue,status,current) {
  if (currentUser.role === "student") return "";

  const cls =
    status === current ? "selected" : "";

  const className =
    status === "Present"
    ? "att-present"
    : status === "Absent"
      ? "att-absent"
      : "att-late";

  return `
    <button
      class="att-btn ${className} ${cls}"
      onclick="setAttendance('${uidValue}','${status}')"
    >
      ${status}
    </button>
  `;
}

function setAttendance(studentUid,status) {
  db.attendance[attendanceDate] ||= {};
  db.attendance[attendanceDate][studentUid] = status;
  saveDB();
  renderPage();
}

function markAllAttendance(status) {
  db.attendance[attendanceDate] ||= {};

  db.students
    .filter(s =>
      s.active !== false &&
      (!attendanceClass || s.className === attendanceClass)
    )
    .forEach(s => {
      db.attendance[attendanceDate][s.uid] = status;
    });

  saveDB();
  renderPage();
  showToast(`Students marked ${status}`, "success");
}

function saveAttendance() {
  saveDB();
  addActivity("📅", `Attendance saved for ${formatDate(attendanceDate)}.`);
  showToast("Attendance saved successfully", "success");
}

function attendanceSummary(date) {
  const students = db.students.filter(s => s.active !== false);
  const records = db.attendance[date] || {};

  let present = 0;
  let absent = 0;
  let late = 0;

  students.forEach(s => {
    if (records[s.uid] === "Present") present++;
    if (records[s.uid] === "Absent") absent++;
    if (records[s.uid] === "Late") late++;
  });

  const marked = present + absent + late;

  return {
    present,
    absent,
    late,
    marked,
    total: students.length,
    percent: marked ? ((present + late)/marked)*100 : 0
  };
}

function studentAttendancePercentage(studentUid) {
  let present = 0;
  let marked = 0;

  Object.values(db.attendance).forEach(day => {
    const status = day[studentUid];

    if (status) {
      marked++;
      if (status === "Present" || status === "Late") {
        present++;
      }
    }
  });

  if (!marked) return 0;

  return (present/marked)*100;
}

function renderStudentAttendance() {
  const records = [];

  Object.entries(db.attendance).forEach(([date,map]) => {
    const s = db.students.find(x => x.name === currentUser.name);

    if (s && map[s.uid]) {
      records.push({
        date,
        status: map[s.uid]
      });
    }
  });

  records.sort((a,b) => b.date.localeCompare(a.date));

  return `
    <div class="card-body">

      ${
        records.length
        ? `
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${records.map(r => `
                  <tr>
                    <td>${formatDate(r.date)}</td>
                    <td>${statusBadge(r.status)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `
        : emptyHTML("📅","No attendance records")
      }

    </div>
  `;
}

function attendanceReportTable() {
  return `
    <div class="table-wrap">

      <table>

        <thead>
          <tr>
            <th>Student</th>
            <th>Class</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Late</th>
            <th>Attendance</th>
          </tr>
        </thead>

        <tbody>

          ${db.students
            .filter(s => s.active !== false)
            .map(s => {

              let present = 0;
              let absent = 0;
              let late = 0;

              Object.values(db.attendance).forEach(day => {
                if (day[s.uid] === "Present") present++;
                if (day[s.uid] === "Absent") absent++;
                if (day[s.uid] === "Late") late++;
              });

              const total = present + absent + late;
              const percent = total
                ? ((present+late)/total)*100
                : 0;

              return `
                <tr>
                  <td>${esc(s.name)}</td>
                  <td>${esc(s.className)}</td>
                  <td>${present}</td>
                  <td>${absent}</td>
                  <td>${late}</td>
                  <td>
                    <strong>${percentage(percent)}</strong>
                  </td>
                </tr>
              `;
            }).join("")}

        </tbody>

      </table>

    </div>
  `;
}

/* =========================================================
   FEES
========================================================= */

let feeClass = "";
let feeStatus = "";

function renderFees() {
  if (currentUser.role === "student") {
    const s = db.students.find(x => x.name === currentUser.name);

    return `
      <div class="page">
        <div class="page-header">
          <div>
            <h1 class="page-title">My Fees</h1>
            <p class="page-subtitle">Fee status and payment history</p>
          </div>
        </div>

        ${
          s
          ? studentFeeView(s)
          : emptyHTML("💰","No student account linked")
        }
      </div>
    `;
  }

  let students = db.students.filter(s => s.active !== false);

  if (feeClass) {
    students = students.filter(s => s.className === feeClass);
  }

  if (feeStatus === "paid") {
    students = students.filter(s =>
      Number(s.paidFees || 0) >= Number(s.totalFees || 0)
    );
  }

  if (feeStatus === "pending") {
    students = students.filter(s =>
      Number(s.paidFees || 0) < Number(s.totalFees || 0)
    );
  }

  const total = students.reduce((a,s) => a + Number(s.totalFees||0),0);
  const paid = students.reduce((a,s) => a + Number(s.paidFees||0),0);
  const pending = Math.max(0,total-paid);

  return `
    <div class="page">

      <div class="page-header">
        <div>
          <h1 class="page-title">Fees</h1>
          <p class="page-subtitle">Fee collection and payment management</p>
        </div>
      </div>

      <div class="stats-grid">

        ${statCard("💰","Expected",money(total))}
        ${statCard("✅","Collected",money(paid))}
        ${statCard("⏳","Pending",money(pending))}
        ${statCard("👨‍🎓","Students",students.length)}

      </div>

      <div class="toolbar">

        <select
          class="select"
          style="width:180px;"
          onchange="feeClass=this.value;renderPage()"
        >
          <option value="">All Classes</option>
          ${CLASS_LIST.map(c => `
            <option ${feeClass===c?"selected":""}>${esc(c)}</option>
          `).join("")}
        </select>

        <select
          class="select"
          style="width:180px;"
          onchange="feeStatus=this.value;renderPage()"
        >
          <option value="">All Status</option>
          <option value="paid" ${feeStatus==="paid"?"selected":""}>Paid</option>
          <option value="pending" ${feeStatus==="pending"?"selected":""}>Pending</option>
        </select>

      </div>

      <div class="card">

        <div class="table-wrap">

          <table>

            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Total Fee</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              ${
                students.length
                ? students.map(s => {

                  const pending = Math.max(
                    0,
                    Number(s.totalFees||0)-Number(s.paidFees||0)
                  );

                  return `
                    <tr>

                      <td><strong>${esc(s.name)}</strong></td>
                      <td>${esc(s.className)}</td>
                      <td>${money(s.totalFees)}</td>
                      <td>${money(s.paidFees)}</td>
                      <td>${money(pending)}</td>

                      <td>
                        ${
                          pending === 0
                          ? `<span class="badge badge-success">Paid</span>`
                          : `<span class="badge badge-warning">Pending</span>`
                        }
                      </td>

                      <td>
                        <div class="actions">

                          <button
                            class="btn btn-secondary btn-small"
                            onclick="studentFeeHistory('${s.uid}')"
                          >
                            History
                          </button>

                          ${
                            pending > 0
                            ? `
                              <button
                                class="btn btn-primary btn-small"
                                onclick="paymentModal('${s.uid}')"
                              >
                                + Payment
                              </button>
                            `
                            : ""
                          }

                        </div>
                      </td>

                    </tr>
                  `;
                }).join("")
                : `<tr><td colspan="7">${emptyHTML("💰","No fee records")}</td></tr>`
              }

            </tbody>

          </table>

        </div>
      </div>

    </div>
  `;
}

function studentFeeView(s) {
  const pending = Math.max(
    0,
    Number(s.totalFees||0)-Number(s.paidFees||0)
  );

  return `
    <div class="stats-grid">

      ${statCard("💰","Total Fee",money(s.totalFees))}
      ${statCard("✅","Paid",money(s.paidFees))}
      ${statCard("⏳","Pending",money(pending))}
      ${statCard("🧾","Payments",db.payments.filter(p=>p.studentUid===s.uid).length)}

    </div>

    <div class="card">
      <div class="card-header">
        <h3>Payment History</h3>
      </div>
      <div class="card-body">
        ${
          db.payments.filter(p => p.studentUid === s.uid).length
          ? `
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Month</th>
                    <th>Amount</th>
                    <th>Method</th>
                  </tr>
                </thead>
                <tbody>
                  ${db.payments
                    .filter(p=>p.studentUid===s.uid)
                    .map(p=>`
                      <tr>
                        <td>${formatDate(p.date)}</td>
                        <td>${esc(p.month||"-")}</td>
                        <td>${money(p.amount)}</td>
                        <td>${esc(p.method)}</td>
                      </tr>
                    `).join("")}
                </tbody>
              </table>
            </div>
          `
          : emptyHTML("💰","No payments recorded")
        }
      </div>
    </div>
  `;
}

function paymentModal(studentUid) {
  const s = db.students.find(x => x.uid === studentUid);
  if (!s) return;

  const pending = Math.max(
    0,
    Number(s.totalFees||0)-Number(s.paidFees||0)
  );

  showModal(
    "Record Payment",
    `
      <form id="paymentForm">

        <div style="background:#eff6ff;padding:15px;border-radius:10px;margin-bottom:18px;">
          <strong>${esc(s.name)}</strong><br>
          ${esc(s.className)}<br>
          Pending: <strong>${money(pending)}</strong>
        </div>

        <div class="form-group">
          <label class="form-label">Amount</label>
          <input
            class="input"
            type="number"
            name="amount"
            min="1"
            max="${pending}"
            required
            value="${pending}"
          >
        </div>

        <div class="form-grid">

          <div class="form-group">
            <label class="form-label">Month</label>
            <input
              class="input"
              name="month"
              placeholder="September 2026"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Payment Date</label>
            <input
              class="input"
              type="date"
              name="date"
              value="${today()}"
            >
          </div>

        </div>

        <div class="form-group">
          <label class="form-label">Payment Method</label>

          <select class="select" name="method">
            <option>Cash</option>
            <option>UPI</option>
            <option>Bank Transfer</option>
            <option>Cheque</option>
            <option>Other</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Note</label>
          <textarea class="textarea" name="note" placeholder="Optional note"></textarea>
        </div>

        <div class="modal-footer" style="margin:0 -22px -22px;">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">
            Cancel
          </button>
          <button class="btn btn-primary">
            💾 Record Payment
          </button>
        </div>

      </form>
    `,
    false
  );

  document.getElementById("paymentForm").onsubmit =
    e => savePayment(e, studentUid);
}

function savePayment(event,studentUid) {
  event.preventDefault();

  const form = event.target;
  const s = db.students.find(x=>x.uid===studentUid);

  if (!s) return;

  const amount = Number(form.amount.value || 0);
  const pending = Math.max(
    0,
    Number(s.totalFees||0)-Number(s.paidFees||0)
  );

  if (amount <= 0 || amount > pending) {
    showToast("Invalid payment amount", "error");
    return;
  }

  s.paidFees = Number(s.paidFees||0) + amount;

  db.payments.push({
    id: uid("PAY"),
    studentUid,
    amount,
    date: form.date.value,
    month: form.month.value,
    method: form.method.value,
    note: form.note.value
  });

  addActivity("💰", `${s.name} paid ${money(amount)}.`);

  saveDB();
  closeModal();
  renderPage();

  showToast("Payment recorded successfully", "success");
}

function studentFeeHistory(studentUid) {
  const s = db.students.find(x=>x.uid===studentUid);
  if (!s) return;

  const payments = db.payments.filter(p=>p.studentUid===studentUid);

  showModal(
    `${s.name} - Fee History`,
    `
      <div class="stats-grid">

        ${statCard("💰","Total Fee",money(s.totalFees))}
        ${statCard("✅","Paid",money(s.paidFees))}
        ${statCard("⏳","Pending",money(Math.max(0,s.totalFees-s.paidFees)))}
        ${statCard("🧾","Payments",payments.length)}

      </div>

      ${
        payments.length
        ? `
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                ${payments.map(p=>`
                  <tr>
                    <td>${formatDate(p.date)}</td>
                    <td>${esc(p.month||"-")}</td>
                    <td>${money(p.amount)}</td>
                    <td>${esc(p.method)}</td>
                    <td>${esc(p.note||"-")}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `
        : emptyHTML("🧾","No payments yet")
      }
    `,
    true
  );
}

/* =========================================================
   HOMEWORK
========================================================= */

function renderHomework() {
  let list = [...db.homework];

  if (currentUser.role === "student") {
    const s = db.students.find(x => x.name === currentUser.name);

    if (s) {
      list = list.filter(h => h.className === s.className);
    }
  }

  list.sort((a,b)=>b.assignedDate.localeCompare(a.assignedDate));

  return `
    <div class="page">

      <div class="page-header">

        <div>
          <h1 class="page-title">Homework</h1>
          <p class="page-subtitle">
            Assignments and study work
          </p>
        </div>

        ${
          currentUser.role !== "student"
          ? `<button class="btn btn-primary" onclick="homeworkModal()">
               ＋ Add Homework
             </button>`
          : ""
        }

      </div>

      <div class="card">

        <div class="table-wrap">

          <table>

            <thead>
              <tr>
                <th>Subject</th>
                <th>Homework</th>
                <th>Class</th>
                <th>Assigned</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              ${
                list.length
                ? list.map(h => `
                  <tr>

                    <td>${esc(h.subject)}</td>

                    <td>
                      <strong>${esc(h.title)}</strong>
                      ${
                        h.description
                        ? `<br><small style="color:#64748b;">${esc(h.description)}</small>`
                        : ""
                      }
                    </td>

                    <td>${esc(h.className)}</td>

                    <td>${formatDate(h.assignedDate)}</td>

                    <td>${formatDate(h.dueDate)}</td>

                    <td>
                      ${
                        new Date(h.dueDate) < new Date()
                        ? `<span class="badge badge-danger">Due</span>`
                        : `<span class="badge badge-success">Active</span>`
                      }
                    </td>

                    <td>
                      <div class="actions">

                        ${
                          h.attachment
                          ? `<button class="btn btn-secondary btn-small" onclick="openHomeworkAttachment('${h.id}')">
                               📄 File
                             </button>`
                          : ""
                        }

                        ${
                          currentUser.role !== "student"
                          ? `
                            <button class="btn btn-secondary btn-small" onclick="homeworkModal('${h.id}')">
                              ✏️
                            </button>

                            <button class="btn btn-danger btn-small" onclick="deleteHomework('${h.id}')">
                              🗑️
                            </button>
                          `
                          : ""
                        }

                      </div>
                    </td>

                  </tr>
                `).join("")
                : `<tr><td colspan="7">${emptyHTML("📚","No homework available")}</td></tr>`
              }

            </tbody>

          </table>

        </div>
      </div>
    </div>
  `;
}

function homeworkModal(homeworkId = null) {
  const h = homeworkId
    ? db.homework.find(x=>x.id===homeworkId)
    : null;

  showModal(
    h ? "Edit Homework" : "Add Homework",
    `
      <form id="homeworkForm">

        <input type="hidden" name="id" value="${h?.id||""}">

        <div class="form-grid">

          <div class="form-group">
            <label class="form-label">Subject</label>
            <select class="select" name="subject">
              ${SUBJECTS.map(s=>`
                <option ${h?.subject===s?"selected":""}>${esc(s)}</option>
              `).join("")}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Class</label>
            <select class="select" name="className">
              ${CLASS_LIST.map(c=>`
                <option ${h?.className===c?"selected":""}>${esc(c)}</option>
              `).join("")}
            </select>
          </div>

        </div>

        <div class="form-group">
          <label class="form-label">Homework Title</label>
          <input
            class="input"
            name="title"
            required
            value="${esc(h?.title||"")}"
          >
        </div>

        <div class="form-group">
          <label class="form-label">Description / Questions</label>
          <textarea
            class="textarea"
            name="description"
          >${esc(h?.description||"")}</textarea>
        </div>

        <div class="form-grid">

          <div class="form-group">
            <label class="form-label">Assigned Date</label>
            <input
              class="input"
              type="date"
              name="assignedDate"
              value="${h?.assignedDate||today()}"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Due Date</label>
            <input
              class="input"
              type="date"
              name="dueDate"
              value="${h?.dueDate||today()}"
            >
          </div>

        </div>

        <div class="form-group">
          <label class="form-label">Attachment</label>
          <input
            type="file"
            class="input"
            id="homeworkFile"
            accept=".pdf,image/*"
          >
        </div>

        <div class="modal-footer" style="margin:0 -22px -22px;">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">
            Cancel
          </button>

          <button class="btn btn-primary">
            💾 Save Homework
          </button>
        </div>

      </form>
    `,
    false
  );

  document.getElementById("homeworkForm").onsubmit =
    e => saveHomework(e,h);
}

async function saveHomework(event,existing) {
  event.preventDefault();

  const form = event.target;
  const file = document.getElementById("homeworkFile").files[0];

  const attachment = file
    ? await fileToDataURL(file)
    : existing?.attachment || "";

  const item = {
    id: form.id.value || uid("HW"),
    subject: form.subject.value,
    className: form.className.value,
    title: form.title.value.trim(),
    description: form.description.value.trim(),
    assignedDate: form.assignedDate.value,
    dueDate: form.dueDate.value,
    attachment,
    active: true
  };

  if (!item.title) {
    showToast("Homework title is required","error");
    return;
  }

  if (existing) {
    Object.assign(existing,item);
  } else {
    db.homework.push(item);
  }

  addActivity("📚",`${item.title} homework was ${existing ? "updated" : "assigned"}.`);

  saveDB();
  closeModal();
  renderPage();

  showToast("Homework saved successfully","success");
}

function deleteHomework(id) {
  const h = db.homework.find(x=>x.id===id);
  if (!h) return;

  if (!confirm(`Delete "${h.title}"?`)) return;

  db.homework = db.homework.filter(x=>x.id!==id);
  saveDB();
  renderPage();

  showToast("Homework deleted","success");
}

function openHomeworkAttachment(id) {
  const h = db.homework.find(x=>x.id===id);
  if (!h?.attachment) return;

  openDataFile(h.attachment);
}

/* =========================================================
   NOTICES
========================================================= */

function renderNotices() {
  let notices = [...db.notices];

  if (currentUser.role === "student") {
    notices = notices.filter(n => n.active !== false);
  }

  notices.sort((a,b)=>b.date.localeCompare(a.date));

  return `
    <div class="page">

      <div class="page-header">

        <div>
          <h1 class="page-title">Notices</h1>
          <p class="page-subtitle">Institute announcements</p>
        </div>

        ${
          currentUser.role === "admin"
          ? `<button class="btn btn-primary" onclick="noticeModal()">
               ＋ Create Notice
             </button>`
          : ""
        }

      </div>

      <div style="display:flex;flex-direction:column;gap:13px;">

        ${
          notices.length
          ? notices.map(n=>`
            <div class="card">

              <div class="card-body">

                <div style="display:flex;justify-content:space-between;gap:15px;">

                  <div style="flex:1;">

                    <div style="font-weight:800;font-size:17px;">
                      📢 ${esc(n.title)}
                    </div>

                    <div style="margin-top:9px;line-height:1.6;">
                      ${esc(n.message)}
                    </div>

                    <div style="margin-top:11px;display:flex;gap:7px;flex-wrap:wrap;">

                      <span class="badge badge-gray">
                        ${formatDate(n.date)}
                      </span>

                      <span class="badge ${n.priority==="Urgent"?"badge-danger":n.priority==="Important"?"badge-warning":"badge-info"}">
                        ${esc(n.priority)}
                      </span>

                      <span class="badge badge-gray">
                        ${esc(n.audience)}
                      </span>

                    </div>

                  </div>

                  ${
                    currentUser.role === "admin"
                    ? `
                      <div class="actions">

                        <button
                          class="btn btn-secondary btn-small"
                          onclick="noticeModal('${n.id}')"
                        >
                          ✏️
                        </button>

                        <button
                          class="btn btn-danger btn-small"
                          onclick="deleteNotice('${n.id}')"
                        >
                          🗑️
                        </button>

                      </div>
                    `
                    : ""
                  }

                </div>

              </div>

            </div>
          `).join("")
          : emptyHTML("📢","No notices")
        }

      </div>

    </div>
  `;
}

function noticeModal(noticeId=null) {
  const n = noticeId
    ? db.notices.find(x=>x.id===noticeId)
    : null;

  showModal(
    n ? "Edit Notice" : "Create Notice",
    `
      <form id="noticeForm">

        <input type="hidden" name="id" value="${n?.id||""}">

        <div class="form-group">
          <label class="form-label">Title</label>
          <input
            class="input"
            name="title"
            required
            value="${esc(n?.title||"")}"
          >
        </div>

        <div class="form-group">
          <label class="form-label">Message</label>
          <textarea
            class="textarea"
            name="message"
            required
          >${esc(n?.message||"")}</textarea>
        </div>

        <div class="form-grid">

          <div class="form-group">
            <label class="form-label">Date</label>
            <input
              type="date"
              class="input"
              name="date"
              value="${n?.date||today()}"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Audience</label>
            <select class="select" name="audience">
              <option ${n?.audience==="All"?"selected":""}>All</option>
              ${CLASS_LIST.map(c=>`
                <option ${n?.audience===c?"selected":""}>
                  ${esc(c)}
                </option>
              `).join("")}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Priority</label>
            <select class="select" name="priority">
              ${["Normal","Important","Urgent"].map(p=>`
                <option ${n?.priority===p?"selected":""}>${p}</option>
              `).join("")}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Expiry Date</label>
            <input
              type="date"
              class="input"
              name="expiry"
              value="${n?.expiry||""}"
            >
          </div>

        </div>

        <div class="modal-footer" style="margin:0 -22px -22px;">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">
            Cancel
          </button>

          <button class="btn btn-primary">
            📢 Publish Notice
          </button>
        </div>

      </form>
    `,
    false
  );

  document.getElementById("noticeForm").onsubmit =
    e=>saveNotice(e,n);
}

function saveNotice(event,existing) {
  event.preventDefault();

  const form = event.target;

  const item = {
    id: form.id.value || uid("NOT"),
    title: form.title.value.trim(),
    message: form.message.value.trim(),
    date: form.date.value,
    audience: form.audience.value,
    priority: form.priority.value,
    expiry: form.expiry.value,
    active: true
  };

  if (!item.title || !item.message) {
    showToast("Title and message are required","error");
    return;
  }

  if (existing) {
    Object.assign(existing,item);
  } else {
    db.notices.push(item);
  }

  addActivity("📢",`Notice "${item.title}" was published.`);

  saveDB();
  closeModal();
  renderPage();

  showToast("Notice saved successfully","success");
}

function deleteNotice(id) {
  const n = db.notices.find(x=>x.id===id);
  if (!n) return;

  if (!confirm(`Delete notice "${n.title}"?`)) return;

  db.notices = db.notices.filter(x=>x.id!==id);
  saveDB();
  renderPage();

  showToast("Notice deleted","success");
}

/* =========================================================
   REPORTS
========================================================= */

function renderReports() {
  const students = db.students.filter(s=>s.active!==false);

  const ranked = students
    .map(s=>({
      ...s,
      avg:getStudentAverage(s.uid),
      att:studentAttendancePercentage(s.uid)
    }))
    .filter(s=>s.avg!=null)
    .sort((a,b)=>b.avg-a.avg);

  const collected = students.reduce(
    (a,s)=>a+Number(s.paidFees||0),0
  );

  const expected = students.reduce(
    (a,s)=>a+Number(s.totalFees||0),0
  );

  return `
    <div class="page">

      <div class="page-header">

        <div>
          <h1 class="page-title">Reports</h1>
          <p class="page-subtitle">
            Academic, attendance and fee overview
          </p>
        </div>

        <div class="actions">

          <button class="btn btn-secondary" onclick="window.print()">
            🖨️ Print
          </button>

          <button class="btn btn-primary" onclick="exportCSV()">
            📥 Export CSV
          </button>

        </div>

      </div>

      <div class="report-grid">

        ${statCard("👨‍🎓","Students",students.length)}

        ${statCard("📈","Average",
          ranked.length
          ? percentage(ranked.reduce((a,s)=>a+s.avg,0)/ranked.length)
          : "-"
        )}

        ${statCard("💰","Collected",money(collected))}

      </div>

      <div class="grid-2" style="margin-top:20px;">

        <div class="card">

          <div class="card-header">
            <h3>🏆 Student Ranking</h3>
          </div>

          <div class="table-wrap">

            <table>

              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Average</th>
                  <th>Attendance</th>
                </tr>
              </thead>

              <tbody>

                ${
                  ranked.length
                  ? ranked.map((s,i)=>`
                    <tr>
                      <td>
                        <strong>
                          ${i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}
                        </strong>
                      </td>
                      <td>${esc(s.name)}</td>
                      <td>${esc(s.className)}</td>
                      <td>${percentage(s.avg)}</td>
                      <td>${percentage(s.att)}</td>
                    </tr>
                  `).join("")
                  : `<tr><td colspan="5">${emptyHTML("🏆","No test results available")}</td></tr>`
                }

              </tbody>

            </table>

          </div>

        </div>

        <div class="card">

          <div class="card-header">
            <h3>💰 Fee Summary</h3>
          </div>

          <div class="card-body">

            <div style="display:grid;gap:15px;">

              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:7px;">
                  <span>Collection</span>
                  <strong>${money(collected)}</strong>
                </div>

                <div class="progress">
                  <div
                    class="progress-bar"
                    style="width:${expected ? Math.min(100,(collected/expected)*100) : 0}%"
                  ></div>
                </div>
              </div>

              <div class="mini-stat">
                <span>Expected Fees</span>
                <strong>${money(expected)}</strong>
              </div>

              <div class="mini-stat">
                <span>Pending Fees</span>
                <strong>${money(Math.max(0,expected-collected))}</strong>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  `;
}

function exportCSV() {
  const rows = [
    ["ID","Student","Class","Batch","Attendance","Average","Total Fee","Paid","Pending"]
  ];

  db.students
    .filter(s=>s.active!==false)
    .forEach(s=>{
      rows.push([
        s.id,
        s.name,
        s.className,
        s.batch||"",
        percentage(studentAttendancePercentage(s.uid)),
        getStudentAverage(s.uid)==null
          ? ""
          : percentage(getStudentAverage(s.uid)),
        s.totalFees,
        s.paidFees,
        Math.max(0,s.totalFees-s.paidFees)
      ]);
    });

  const csv = rows
    .map(row => row.map(x =>
      `"${String(x).replaceAll('"','""')}"`
    ).join(","))
    .join("\n");

  const blob = new Blob([csv],{type:"text/csv"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "coaching-student-report.csv";
  a.click();

  URL.revokeObjectURL(url);

  showToast("CSV report exported","success");
}

/* =========================================================
   SETTINGS
========================================================= */

function renderSettings() {
  return `
    <div class="page">

      <div class="page-header">
        <div>
          <h1 class="page-title">Settings</h1>
          <p class="page-subtitle">Institute and application settings</p>
        </div>
      </div>

      <div class="card">

        <div class="card-header">
          <h3>🏫 Institute Information</h3>
        </div>

        <div class="card-body">

          <form id="settingsForm">

            <div class="form-grid">

              <div class="form-group">
                <label class="form-label">Institute Name</label>
                <input
                  class="input"
                  name="instituteName"
                  value="${esc(db.settings.instituteName)}"
                >
              </div>

              <div class="form-group">
                <label class="form-label">Academic Year</label>
                <input
                  class="input"
                  name="academicYear"
                  value="${esc(db.settings.academicYear)}"
                >
              </div>

              <div class="form-group">
                <label class="form-label">Phone</label>
                <input
                  class="input"
                  name="phone"
                  value="${esc(db.settings.phone)}"
                >
              </div>

              <div class="form-group">
                <label class="form-label">Email</label>
                <input
                  class="input"
                  name="email"
                  value="${esc(db.settings.email)}"
                >
              </div>

            </div>

            <div class="form-group">
              <label class="form-label">Address</label>
              <textarea class="textarea" name="address">${esc(db.settings.address)}</textarea>
            </div>

            <button class="btn btn-primary">
              💾 Save Settings
            </button>

          </form>

        </div>

      </div>

      <div class="card" style="margin-top:20px;">

        <div class="card-header">
          <h3>💾 Data Management</h3>
        </div>

        <div class="card-body">

          <p style="color:#64748b;margin-bottom:15px;">
            Current version stores information in this browser using localStorage.
          </p>

          <div class="actions">

            <button class="btn btn-secondary" onclick="backupData()">
              📥 Backup Data
            </button>

            <label class="btn btn-secondary" style="cursor:pointer;">
              📤 Restore Data
              <input
                type="file"
                accept=".json"
                style="display:none"
                onchange="restoreData(event)"
              >
            </label>

            <button class="btn btn-danger" onclick="resetDatabase()">
              ⚠️ Reset Demo Data
            </button>

          </div>

        </div>

      </div>

      <div class="card" style="margin-top:20px;">

        <div class="card-header">
          <h3>ℹ️ Current Version</h3>
        </div>

        <div class="card-body">

          <p>
            <strong>Coaching Management System v3</strong>
          </p>

          <p style="color:#64748b;margin-top:7px;">
            Designed for small coaching institutes with Nursery to Class 9.
          </p>

          <p style="color:#64748b;margin-top:7px;">
            Data is currently browser-based. A shared Firebase/Supabase
            backend can be connected later.
          </p>

        </div>

      </div>

    </div>
  `;

  setTimeout(()=>{
    const form=document.getElementById("settingsForm");

    if(form){
      form.onsubmit=e=>{
        e.preventDefault();

        const data=Object.fromEntries(new FormData(form));

        db.settings={
          ...db.settings,
          ...data
        };

        saveDB();
        render();
        showToast("Settings saved","success");
      };
    }
  },0);
}

function backupData() {
  const blob = new Blob(
    [JSON.stringify(db,null,2)],
    {type:"application/json"}
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href=url;
  a.download="coaching-management-backup.json";
  a.click();

  URL.revokeObjectURL(url);

  showToast("Backup downloaded","success");
}

function restoreData(event) {
  const file=event.target.files[0];

  if(!file) return;

  const reader=new FileReader();

  reader.onload=e=>{
    try{
      const imported=JSON.parse(e.target.result);

      if(
        !imported ||
        !Array.isArray(imported.students) ||
        !Array.isArray(imported.teachers)
      ){
        throw new Error("Invalid backup");
      }

      db=imported;
      saveDB();
      render();

      showToast("Backup restored successfully","success");

    }catch(error){
      showToast("Invalid backup file","error");
    }
  };

  reader.readAsText(file);
}

function resetDatabase() {
  if(!confirm(
    "This will erase the current browser data and restore demo data. Continue?"
  )) return;

  const fresh=defaultDB();
  db=fresh;
  saveDB();

  currentPage="dashboard";
  render();

  showToast("Demo data restored","success");
}

/* =========================================================
   MODAL / FILES / UTILITIES
========================================================= */

function showModal(title,body,large=false) {
  document.getElementById("modalRoot").innerHTML=`
    <div class="modal-overlay" onclick="overlayClose(event)">

      <div class="modal ${large?"large":""}">

        <div class="modal-header">

          <h2>${esc(title)}</h2>

          <button
            class="close-btn"
            onclick="closeModal()"
          >
            ×
          </button>

        </div>

        <div class="modal-body">
          ${body}
        </div>

      </div>

    </div>
  `;
}

function overlayClose(event) {
  if(event.target.classList.contains("modal-overlay")){
    closeModal();
  }
}

function closeModal() {
  const root=document.getElementById("modalRoot");

  if(root) root.innerHTML="";
}

function fileToDataURL(file) {
  return new Promise((resolve,reject)=>{

    if(file.size > 2 * 1024 * 1024){
      showToast(
        "File is larger than 2 MB. Please use a smaller file in this browser version.",
        "error"
      );

      reject(new Error("File too large"));
      return;
    }

    const reader=new FileReader();

    reader.onload=()=>resolve(reader.result);
    reader.onerror=reject;

    reader.readAsDataURL(file);
  });
}

function openAttachment(testId,type) {
  const t=db.tests.find(x=>x.id===testId);

  if(!t) return;

  const file=type==="question"
    ? t.questionPaper
    : t.solution;

  if(file) openDataFile(file);
}

function openDataFile(dataUrl) {
  const win=window.open();

  if(!win){
    showToast("Please allow popups to open the file","error");
    return;
  }

  win.document.write(`
    <html>
      <head>
        <title>Document</title>
        <style>
          html,body{
            margin:0;
            height:100%;
            background:#f1f5f9;
          }
          iframe{
            width:100%;
            height:100%;
            border:0;
          }
          img{
            max-width:100%;
            display:block;
            margin:auto;
          }
        </style>
      </head>
      <body>
        ${
          dataUrl.startsWith("data:image")
          ? `<img src="${dataUrl}">`
          : `<iframe src="${dataUrl}"></iframe>`
        }
      </body>
    </html>
  `);

  win.document.close();
}

function statusBadge(status) {
  if(status==="Present"){
    return `<span class="badge badge-success">Present</span>`;
  }

  if(status==="Absent"){
    return `<span class="badge badge-danger">Absent</span>`;
  }

  if(status==="Late"){
    return `<span class="badge badge-warning">Late</span>`;
  }

  return `<span class="badge badge-gray">${esc(status)}</span>`;
}

function emptyHTML(icon,message) {
  return `
    <div class="empty">
      <div class="empty-icon">${icon}</div>
      <div>${esc(message)}</div>
    </div>
  `;
}

function formatDate(value) {
  if(!value) return "-";

  const d=new Date(value+"T00:00:00");

  if(Number.isNaN(d.getTime())) return value;

  return d.toLocaleDateString("en-IN",{
    day:"2-digit",
    month:"short",
    year:"numeric"
  });
}

function addActivity(icon,text) {
  db.activity ||= [];

  db.activity.push({
    icon,
    text,
    date:today()
  });

  if(db.activity.length>50){
    db.activity=db.activity.slice(-50);
  }

  saveDB();
}

/* =========================================================
   START APPLICATION
========================================================= */

render();
