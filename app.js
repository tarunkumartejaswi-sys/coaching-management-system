/* =========================================================
   COACHING MANAGEMENT SYSTEM
   FIREBASE AUTHENTICATION + FIRESTORE
========================================================= */

const appRoot = document.getElementById("app");

/* =========================================================
   FIREBASE
========================================================= */

const auth = firebase.auth();
const db = firebase.firestore();

/* =========================================================
   CURRENT USER
========================================================= */

let currentUser = null;
let currentProfile = null;

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
    return "₹" + Number(value || 0).toLocaleString("en-IN");
}

function today() {
    return new Date().toISOString().split("T")[0];
}

function showMessage(message) {
    alert(message);
}

/* =========================================================
   LOGIN PAGE
========================================================= */

function loginPage(message = "") {

    appRoot.innerHTML = `
        <div class="login-page">

            <div class="login-card">

                <h1>Coaching Management System</h1>

                <p class="muted">
                    Secure login
                </p>

                ${message ? `
                    <div class="alert">
                        ${escapeHTML(message)}
                    </div>
                ` : ""}

                <form onsubmit="login(event)">

                    <label>Login as</label>

                    <select id="role" required>
                        <option value="admin">Admin</option>
                        <option value="teacher">Teacher</option>
                        <option value="student">Student</option>
                    </select>

                    <label>Email / Username</label>

                    <input
                        id="username"
                        type="text"
                        placeholder="Enter email or username"
                        required
                    >

                    <label>Password</label>

                    <input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        required
                    >

                    <button type="submit">
                        Login
                    </button>

                </form>

            </div>

        </div>
    `;
}

/* =========================================================
   LOGIN
========================================================= */

async function login(event) {

    event.preventDefault();

    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
        showMessage("Please enter username and password.");
        return;
    }

    try {

        let email = username;

        /*
         * Admin currently uses the Firebase email.
         *
         * Teacher/student usernames can later be mapped
         * to their Firebase email from Firestore.
         */

        if (role === "student" && !username.includes("@")) {
            email = username + "@students.cms";
        }

        if (role === "teacher" && !username.includes("@")) {
            email = username + "@teachers.cms";
        }

        const result = await auth.signInWithEmailAndPassword(
            email,
            password
        );

        currentUser = result.user;

        await loadUserProfile(role);

    } catch (error) {

        console.error(error);

        let message = "Invalid username or password.";

        if (error.code === "auth/user-not-found") {
            message = "Account not found.";
        }

        if (error.code === "auth/wrong-password") {
            message = "Incorrect password.";
        }

        if (error.code === "auth/invalid-credential") {
            message = "Invalid username or password.";
        }

        showMessage(message);
    }
}

/* =========================================================
   LOAD USER PROFILE
========================================================= */

async function loadUserProfile(selectedRole) {

    if (!currentUser) {
        loginPage();
        return;
    }

    try {

        const profileRef = db
            .collection("users")
            .doc(currentUser.uid);

        const profileSnap = await profileRef.get();

        if (!profileSnap.exists) {

            /*
             * The first Firebase admin account can be used
             * as the initial administrator.
             */

            if (
                currentUser.email === "admin@coaching.com" &&
                selectedRole === "admin"
            ) {

                currentProfile = {
                    uid: currentUser.uid,
                    name: "Administrator",
                    email: currentUser.email,
                    role: "admin"
                };

                await profileRef.set(currentProfile);

            } else {

                await auth.signOut();

                loginPage(
                    "Your account has not been assigned a role yet."
                );

                return;
            }

        } else {

            currentProfile = profileSnap.data();

            if (currentProfile.role !== selectedRole) {

                await auth.signOut();

                loginPage(
                    "This account does not have permission for the selected role."
                );

                return;
            }
        }

        app(currentProfile.role);

    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to load your account information."
        );
    }
}

/* =========================================================
   MAIN APPLICATION
========================================================= */

function app(role) {

    appRoot.innerHTML = `

        <div class="app-layout">

            <aside class="sidebar">

                <div class="brand">
                    <h2>CMS</h2>
                    <p>Coaching Management</p>
                </div>

                <nav>

                    <button onclick="dashboard()">
                        🏠 Dashboard
                    </button>

                    ${
                        role === "admin" || role === "teacher"
                        ? `
                        <button onclick="studentsPage()">
                            👨‍🎓 Students
                        </button>

                        <button onclick="testsPage()">
                            📝 Tests
                        </button>

                        <button onclick="attendancePage()">
                            📅 Attendance
                        </button>

                        <button onclick="homeworkPage()">
                            📚 Homework
                        </button>

                        <button onclick="noticesPage()">
                            📢 Notices
                        </button>
                        `
                        : ""
                    }

                    ${
                        role === "admin"
                        ? `
                        <button onclick="teachersPage()">
                            👨‍🏫 Teachers
                        </button>

                        <button onclick="feesPage()">
                            💰 Fees
                        </button>
                        `
                        : ""
                    }

                    ${
                        role === "student"
                        ? `
                        <button onclick="studentResultsPage()">
                            📊 My Results
                        </button>

                        <button onclick="studentAttendancePage()">
                            📅 My Attendance
                        </button>

                        <button onclick="studentHomeworkPage()">
                            📚 My Homework
                        </button>

                        <button onclick="studentNoticesPage()">
                            📢 Notices
                        </button>
                        `
                        : ""
                    }

                    <button onclick="logout()">
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
   DASHBOARD
========================================================= */

async function dashboard() {

    const view = document.getElementById("view");

    if (!view) return;

    if (currentProfile.role === "student") {

        await studentDashboard();
        return;
    }

    view.innerHTML = `

        <div class="topbar">

            <div>
                <h1>Dashboard</h1>

                <p class="muted">
                    Welcome, ${escapeHTML(currentProfile.name)}
                </p>
            </div>

        </div>

        <div class="cards">

            <div class="card">
                <h3>Students</h3>
                <p id="studentCount">Loading...</p>
            </div>

            <div class="card">
                <h3>Teachers</h3>
                <p id="teacherCount">Loading...</p>
            </div>

            <div class="card">
                <h3>Tests</h3>
                <p id="testCount">Loading...</p>
            </div>

            <div class="card">
                <h3>Role</h3>
                <p>${escapeHTML(currentProfile.role)}</p>
            </div>

        </div>
    `;

    try {

        const students = await db.collection("students").get();
        const teachers = await db.collection("teachers").get();
        const tests = await db.collection("tests").get();

        document.getElementById("studentCount").textContent =
            students.size;

        document.getElementById("teacherCount").textContent =
            teachers.size;

        document.getElementById("testCount").textContent =
            tests.size;

    } catch (error) {

        console.error(error);
    }
}

/* =========================================================
   STUDENTS
========================================================= */

async function studentsPage() {

    if (
        currentProfile.role !== "admin" &&
        currentProfile.role !== "teacher"
    ) {
        return;
    }

    document.getElementById("view").innerHTML = `

        <div class="topbar">

            <div>
                <h1>Students</h1>
                <p class="muted">
                    Student management
                </p>
            </div>

            ${
                currentProfile.role === "admin"
                ? `
                <button onclick="addStudent()">
                    ➕ Add Student
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
                        <th>Name</th>
                        <th>Class</th>
                        <th>Batch</th>
                        <th>Phone</th>
                        <th>Pending Fee</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody id="studentsTable">
                    <tr>
                        <td colspan="7">
                            Loading...
                        </td>
                    </tr>
                </tbody>

            </table>

        </div>
    `;

    await renderStudents();
}

async function renderStudents() {

    const table = document.getElementById("studentsTable");

    if (!table) return;

    try {

        const snapshot =
            await db.collection("students").get();

        if (snapshot.empty) {

            table.innerHTML = `
                <tr>
                    <td colspan="7">
                        No students found.
                    </td>
                </tr>
            `;

            return;
        }

        table.innerHTML = "";

        snapshot.forEach(doc => {

            const s = doc.data();

            const pending =
                Number(s.fees || 0) -
                Number(s.paid || 0);

            table.innerHTML += `

                <tr>

                    <td>${escapeHTML(s.id)}</td>

                    <td>${escapeHTML(s.name)}</td>

                    <td>${escapeHTML(s.className)}</td>

                    <td>${escapeHTML(s.batch)}</td>

                    <td>${escapeHTML(s.phone)}</td>

                    <td>${money(pending)}</td>

                    <td>

                        ${
                            currentProfile.role === "admin"
                            ? `
                            <button
                                onclick="editStudent('${doc.id}')"
                            >
                                Edit
                            </button>

                            <button
                                onclick="deleteStudent('${doc.id}')"
                            >
                                Delete
                            </button>
                            `
                            : `
                            <span class="muted">
                                View only
                            </span>
                            `
                        }

                    </td>

                </tr>
            `;
        });

    } catch (error) {

        console.error(error);

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load students.
                </td>
            </tr>
        `;
    }
}

/* =========================================================
   ADD STUDENT
========================================================= */

async function addStudent() {

    if (currentProfile.role !== "admin") {
        showMessage("Only Admin can add students.");
        return;
    }

    const id = prompt("Student ID:");

    if (!id) return;

    const name = prompt("Student name:");

    if (!name) return;

    const className = prompt(
        "Class:",
        "Class 12"
    );

    const batch = prompt(
        "Batch:",
        "Class 12 A"
    );

    const phone = prompt(
        "Phone number:"
    );

    const fees = Number(
        prompt("Total fees:", "12000")
    );

    const paid = Number(
        prompt("Paid amount:", "0")
    );

    const username = prompt(
        "Student username:",
        id.toLowerCase()
    );

    if (!username) return;

    const password = prompt(
        "Student password:"
    );

    if (!password) return;

    try {

        await db.collection("students").add({

            id,
            name,
            className,
            batch,
            phone,
            fees,
            paid,

            username,

            /*
             * This is stored only as coaching-system data.
             *
             * Firebase Authentication remains the actual
             * password system.
             */

            createdAt:
                firebase.firestore.FieldValue.serverTimestamp()

        });

        showMessage(
            "Student record created.\n\n" +
            "Important: create the student's Firebase Authentication account with the matching login before the student can sign in."
        );

        studentsPage();

    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to create student."
        );
    }
}

/* =========================================================
   EDIT STUDENT
========================================================= */

async function editStudent(id) {

    if (currentProfile.role !== "admin") {
        showMessage("Only Admin can edit students.");
        return;
    }

    try {

        const ref =
            db.collection("students").doc(id);

        const snap = await ref.get();

        if (!snap.exists) {
            showMessage("Student not found.");
            return;
        }

        const s = snap.data();

        const name =
            prompt("Student name:", s.name);

        if (!name) return;

        const batch =
            prompt("Batch:", s.batch);

        const phone =
            prompt("Phone:", s.phone);

        const fees =
            Number(
                prompt(
                    "Total fees:",
                    s.fees || 0
                )
            );

        const paid =
            Number(
                prompt(
                    "Paid amount:",
                    s.paid || 0
                )
            );

        await ref.update({

            name,
            batch,
            phone,
            fees,
            paid,

            updatedAt:
                firebase.firestore.FieldValue.serverTimestamp()
        });

        showMessage("Student updated.");

        studentsPage();

    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to update student."
        );
    }
}

/* =========================================================
   DELETE STUDENT
========================================================= */

async function deleteStudent(id) {

    if (currentProfile.role !== "admin") {
        showMessage("Only Admin can delete students.");
        return;
    }

    if (!confirm(
        "Delete this student record?"
    )) {
        return;
    }

    try {

        await db
            .collection("students")
            .doc(id)
            .delete();

        studentsPage();

    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to delete student."
        );
    }
}

/* =========================================================
   TEACHERS
========================================================= */

async function teachersPage() {

    if (currentProfile.role !== "admin") {
        showMessage("Only Admin can access Teachers.");
        return;
    }

    document.getElementById("view").innerHTML = `

        <div class="topbar">

            <div>
                <h1>Teachers</h1>

                <p class="muted">
                    Teaching staff
                </p>
            </div>

            <button onclick="addTeacher()">
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
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody id="teachersTable">
                    <tr>
                        <td colspan="6">
                            Loading...
                        </td>
                    </tr>
                </tbody>

            </table>

        </div>
    `;

    const snapshot =
        await db.collection("teachers").get();

    const table =
        document.getElementById("teachersTable");

    if (snapshot.empty) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    No teachers found.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = "";

    snapshot.forEach(doc => {

        const t = doc.data();

        table.innerHTML += `

            <tr>

                <td>${escapeHTML(t.id)}</td>

                <td>${escapeHTML(t.name)}</td>

                <td>${escapeHTML(t.subject)}</td>

                <td>${escapeHTML(t.batch)}</td>

                <td>${escapeHTML(t.phone)}</td>

                <td>

                    <button
                        onclick="editTeacher('${doc.id}')"
                    >
                        Edit
                    </button>

                    <button
                        onclick="deleteTeacher('${doc.id}')"
                    >
                        Delete
                    </button>

                </td>

            </tr>
        `;
    });
}

/* =========================================================
   ADD TEACHER
========================================================= */

async function addTeacher() {

    if (currentProfile.role !== "admin") {
        showMessage("Only Admin can add teachers.");
        return;
    }

    const id = prompt("Teacher ID:");

    if (!id) return;

    const name =
        prompt("Teacher name:");

    if (!name) return;

    const subject =
        prompt("Subject:");

    const batch =
        prompt("Batch:");

    const phone =
        prompt("Phone:");

    const username =
        prompt(
            "Teacher username:",
            id.toLowerCase()
        );

    if (!username) return;

    await db.collection("teachers").add({

        id,
        name,
        subject,
        batch,
        phone,
        username,

        createdAt:
            firebase.firestore.FieldValue.serverTimestamp()
    });

    showMessage(
        "Teacher added.\n\nCreate the matching Firebase Authentication account before login."
    );

    teachersPage();
}

/* =========================================================
   EDIT TEACHER
========================================================= */

async function editTeacher(id) {

    if (currentProfile.role !== "admin") {
        showMessage("Only Admin can edit teachers.");
        return;
    }

    const ref =
        db.collection("teachers").doc(id);

    const snap = await ref.get();

    if (!snap.exists) return;

    const t = snap.data();

    const name =
        prompt("Teacher name:", t.name);

    const subject =
        prompt("Subject:", t.subject);

    const batch =
        prompt("Batch:", t.batch);

    const phone =
        prompt("Phone:", t.phone);

    await ref.update({

        name,
        subject,
        batch,
        phone,

        updatedAt:
            firebase.firestore.FieldValue.serverTimestamp()
    });

    teachersPage();
}

/* =========================================================
   DELETE TEACHER
========================================================= */

async function deleteTeacher(id) {

    if (currentProfile.role !== "admin") {
        showMessage("Only Admin can delete teachers.");
        return;
    }

    if (!confirm(
        "Delete this teacher?"
    )) {
        return;
    }

    await db
        .collection("teachers")
        .doc(id)
        .delete();

    teachersPage();
}

/* =========================================================
   TESTS
========================================================= */

async function testsPage() {

    document.getElementById("view").innerHTML = `

        <div class="topbar">

            <div>
                <h1>Tests</h1>

                <p class="muted">
                    Tests and results
                </p>
            </div>

            ${
                currentProfile.role === "admin" ||
                currentProfile.role === "teacher"
                ? `
                <button onclick="addTest()">
                    ➕ Add Test
                </button>
                `
                : ""
            }

        </div>

        <div class="table-wrap">

            <table>

                <thead>

                    <tr>
                        <th>Test</th>
                        <th>Subject</th>
                        <th>Date</th>
                        <th>Total Marks</th>
                    </tr>

                </thead>

                <tbody id="testsTable">
                    <tr>
                        <td colspan="4">
                            Loading...
                        </td>
                    </tr>
                </tbody>

            </table>

        </div>
    `;

    const snapshot =
        await db.collection("tests").get();

    const table =
        document.getElementById("testsTable");

    if (snapshot.empty) {

        table.innerHTML = `
            <tr>
                <td colspan="4">
                    No tests found.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = "";

    snapshot.forEach(doc => {

        const t = doc.data();

        table.innerHTML += `

            <tr>

                <td>${escapeHTML(t.name)}</td>

                <td>${escapeHTML(t.subject)}</td>

                <td>${escapeHTML(t.date)}</td>

                <td>${escapeHTML(t.totalMarks)}</td>

            </tr>
        `;
    });
}

async function addTest() {

    if (
        currentProfile.role !== "admin" &&
        currentProfile.role !== "teacher"
    ) {
        return;
    }

    const name =
        prompt("Test name:");

    if (!name) return;

    const subject =
        prompt("Subject:");

    const date =
        prompt(
            "Date:",
            today()
        );

    const totalMarks =
        Number(
            prompt(
                "Total marks:",
                "100"
            )
        );

    await db.collection("tests").add({

        name,
        subject,
        date,
        totalMarks,

        createdAt:
            firebase.firestore.FieldValue.serverTimestamp()
    });

    testsPage();
}

/* =========================================================
   ATTENDANCE
========================================================= */

async function attendancePage() {

    document.getElementById("view").innerHTML = `

        <div class="topbar">

            <div>
                <h1>Attendance</h1>

                <p class="muted">
                    Attendance management
                </p>
            </div>

        </div>

        <div class="card">

            <p>
                Attendance records will be stored in Firebase.
            </p>

            <p class="muted">
                The shared attendance system is ready for the
                next data-management step.
            </p>

        </div>
    `;
}

/* =========================================================
   FEES
========================================================= */

async function feesPage() {

    if (currentProfile.role !== "admin") {
        showMessage("Only Admin can access Fees.");
        return;
    }

    document.getElementById("view").innerHTML = `

        <div class="topbar">

            <div>
                <h1>Fees</h1>

                <p class="muted">
                    Fee management
                </p>

            </div>

        </div>

        <div class="card">

            <h2>Fees Management</h2>

            <p>
                Student fee records are stored in Firestore.
            </p>

            <p class="muted">
                The Admin can manage fee records from the
                Students section.
            </p>

        </div>
    `;
}

/* =========================================================
   HOMEWORK
========================================================= */

async function homeworkPage() {

    document.getElementById("view").innerHTML = `

        <div class="topbar">

            <div>
                <h1>Homework</h1>

                <p class="muted">
                    Homework management
                </p>

            </div>

        </div>

        <div class="card">

            <h2>Homework</h2>

            <p>
                Homework will be stored in Firestore and shown
                to students from their dashboard.
            </p>

        </div>
    `;
}

async function studentHomeworkPage() {

    document.getElementById("view").innerHTML = `

        <div class="topbar">

            <h1>My Homework</h1>

        </div>

        <div class="card">

            <p>
                Your assigned homework will appear here.
            </p>

        </div>
    `;
}

/* =========================================================
   NOTICES
========================================================= */

async function noticesPage() {

    document.getElementById("view").innerHTML = `

        <div class="topbar">

            <div>
                <h1>Notices</h1>

                <p class="muted">
                    Coaching notices
                </p>

            </div>

        </div>

        <div class="card">

            <p>
                Notices will be stored in Firestore.
            </p>

        </div>
    `;
}

async function studentNoticesPage() {

    document.getElementById("view").innerHTML = `

        <div class="topbar">

            <h1>Notices</h1>

        </div>

        <div class="card">

            <p>
                Important coaching notices will appear here.
            </p>

        </div>
    `;
}

/* =========================================================
   STUDENT DASHBOARD
========================================================= */

async function studentDashboard() {

    const view =
        document.getElementById("view");

    let student = null;

    try {

        const snapshot =
            await db
                .collection("students")
                .where(
                    "authUid",
                    "==",
                    currentUser.uid
                )
                .limit(1)
                .get();

        if (!snapshot.empty) {
            student = snapshot.docs[0].data();
        }

    } catch (error) {

        console.error(error);
    }

    view.innerHTML = `

        <div class="topbar">

            <div>

                <h1>Student Dashboard</h1>

                <p class="muted">
                    Welcome,
                    ${escapeHTML(
                        student?.name ||
                        currentProfile.name ||
                        currentUser.email
                    )}
                </p>

            </div>

        </div>

        <div class="cards">

            <div class="card">

                <h3>My Profile</h3>

                <p>
                    ${
                        student
                        ? escapeHTML(student.className || "")
                        : "Profile setup pending"
                    }
                </p>

            </div>

            <div class="card">

                <h3>Pending Fee</h3>

                <p id="studentPendingFee">
                    Loading...
                </p>

            </div>

            <div class="card">

                <h3>Attendance</h3>

                <p>
                    Coming from Firestore
                </p>

            </div>

            <div class="card">

                <h3>Results</h3>

                <p>
                    Coming from Firestore
                </p>

            </div>

        </div>
    `;

    if (student) {

        const pending =
            Number(student.fees || 0) -
            Number(student.paid || 0);

        document.getElementById(
            "studentPendingFee"
        ).textContent = money(pending);
    }
}

/* =========================================================
   STUDENT RESULTS
========================================================= */

async function studentResultsPage() {

    if (currentProfile.role !== "student") {
        return;
    }

    document.getElementById("view").innerHTML = `

        <div class="topbar">

            <h1>My Results</h1>

        </div>

        <div class="card">

            <p>
                Your test results will appear here.
            </p>

        </div>
    `;
}

/* =========================================================
   STUDENT ATTENDANCE
========================================================= */

async function studentAttendancePage() {

    if (currentProfile.role !== "student") {
        return;
    }

    document.getElementById("view").innerHTML = `

        <div class="topbar">

            <h1>My Attendance</h1>

        </div>

        <div class="card">

            <p>
                Your attendance records will appear here.
            </p>

        </div>
    `;
}

/* =========================================================
   LOGOUT
========================================================= */

async function logout() {

    try {

        await auth.signOut();

        currentUser = null;
        currentProfile = null;

        loginPage();

    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to logout."
        );
    }
}

/* =========================================================
   FIREBASE AUTH STATE
========================================================= */

auth.onAuthStateChanged(async user => {

    if (user) {

        currentUser = user;

        /*
         * If a page reload happens while already logged in,
         * load the role from Firestore.
         */

        try {

            const snap =
                await db
                    .collection("users")
                    .doc(user.uid)
                    .get();

            if (snap.exists) {

                currentProfile =
                    snap.data();

                app(currentProfile.role);

            } else {

                loginPage();

            }

        } catch (error) {

            console.error(error);

            loginPage(
                "Unable to load your account."
            );
        }

    } else {

        loginPage();
    }
});
