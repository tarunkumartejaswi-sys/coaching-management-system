/* =========================================================
   COACHING MANAGEMENT SYSTEM
   FIREBASE AUTHENTICATION
========================================================= */

const appRoot = document.getElementById("app");

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


/* =========================================================
   LOGIN PAGE
========================================================= */

function loginPage(message = "") {

    appRoot.innerHTML = `
        <div class="login-page">

            <div class="login-card">

                <h1>Coaching Management System</h1>

                <p class="muted">
                    Secure Login
                </p>

                ${message ? `
                    <div class="alert">
                        ${escapeHTML(message)}
                    </div>
                ` : ""}

                <form id="loginForm">

                    <label>Login as</label>

                    <select id="role" required>

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


                    <label>Email</label>

                    <input
                        id="username"
                        type="email"
                        placeholder="Enter your email"
                        required
                    />


                    <label>Password</label>

                    <input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        required
                    />


                    <button type="submit">
                        Login
                    </button>

                </form>

            </div>

        </div>
    `;


    document
        .getElementById("loginForm")
        .addEventListener("submit", login);
}


/* =========================================================
   LOGIN WITH FIREBASE
========================================================= */

async function login(event) {

    event.preventDefault();

    const role =
        document.getElementById("role").value;

    const email =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;


    try {

        const result =
            await auth.signInWithEmailAndPassword(
                email,
                password
            );

        currentUser = result.user;


        /*
         * Load role from Firestore.
         */

        const userRef =
            db.collection("users")
              .doc(currentUser.uid);

        const userSnap =
            await userRef.get();


        /*
         * First Admin account.
         */

        if (!userSnap.exists) {

            if (
                email === "admin@coaching.com" &&
                role === "admin"
            ) {

                currentProfile = {

                    uid: currentUser.uid,

                    name: "Administrator",

                    email: email,

                    role: "admin"

                };


                await userRef.set(
                    currentProfile
                );

            } else {

                await auth.signOut();

                loginPage(
                    "Your account has not been registered in the coaching system."
                );

                return;
            }

        } else {

            currentProfile =
                userSnap.data();


            if (
                currentProfile.role !== role
            ) {

                await auth.signOut();

                loginPage(
                    "Incorrect role selected for this account."
                );

                return;
            }
        }


        app(currentProfile.role);

    } catch (error) {

        console.error(error);

        let message =
            "Invalid email or password.";


        if (
            error.code ===
            "auth/user-not-found"
        ) {
            message =
                "Account not found.";
        }


        if (
            error.code ===
            "auth/wrong-password"
        ) {
            message =
                "Incorrect password.";
        }


        if (
            error.code ===
            "auth/invalid-credential"
        ) {
            message =
                "Invalid email or password.";
        }


        alert(message);
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

                    <p>
                        Coaching Management
                    </p>

                </div>


                <nav>

                    <button onclick="dashboard()">
                        🏠 Dashboard
                    </button>


                    ${
                        role === "admin" ||
                        role === "teacher"
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

    const view =
        document.getElementById("view");

    if (!view) return;


    if (
        currentProfile.role === "student"
    ) {

        studentDashboard();

        return;
    }


    view.innerHTML = `

        <div class="topbar">

            <div>

                <h1>
                    ${currentProfile.role === "admin"
                        ? "Admin Dashboard"
                        : "Teacher Dashboard"}
                </h1>

                <p class="muted">
                    Welcome,
                    ${escapeHTML(
                        currentProfile.name
                    )}
                </p>

            </div>

        </div>


        <div class="cards">

            <div class="card">

                <h3>Total Students</h3>

                <p id="studentCount">
                    Loading...
                </p>

            </div>


            <div class="card">

                <h3>Total Teachers</h3>

                <p id="teacherCount">
                    Loading...
                </p>

            </div>


            <div class="card">

                <h3>Total Tests</h3>

                <p id="testCount">
                    Loading...
                </p>

            </div>


            <div class="card">

                <h3>Login Role</h3>

                <p>
                    ${escapeHTML(
                        currentProfile.role
                    )}
                </p>

            </div>

        </div>
    `;


    try {

        const students =
            await db
                .collection("students")
                .get();

        const teachers =
            await db
                .collection("teachers")
                .get();

        const tests =
            await db
                .collection("tests")
                .get();


        document.getElementById(
            "studentCount"
        ).textContent =
            students.size;


        document.getElementById(
            "teacherCount"
        ).textContent =
            teachers.size;


        document.getElementById(
            "testCount"
        ).textContent =
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

                    </tr>

                </thead>


                <tbody id="studentsTable">

                    <tr>

                        <td colspan="6">
                            Loading...
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>
    `;


    await renderStudents();
}


/* =========================================================
   RENDER STUDENTS
========================================================= */

async function renderStudents() {

    const table =
        document.getElementById(
            "studentsTable"
        );

    if (!table) return;


    try {

        const snapshot =
            await db
                .collection("students")
                .get();


        if (snapshot.empty) {

            table.innerHTML = `

                <tr>

                    <td colspan="6">
                        No students found.
                    </td>

                </tr>

            `;

            return;
        }


        table.innerHTML = "";


        snapshot.forEach(doc => {

            const student =
                doc.data();


            const pending =
                Number(student.fees || 0) -
                Number(student.paid || 0);


            table.innerHTML += `

                <tr>

                    <td>
                        ${escapeHTML(
                            student.id
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            student.name
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            student.className
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            student.batch
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            student.phone
                        )}
                    </td>

                    <td>
                        ${money(pending)}
                    </td>

                </tr>

            `;
        });

    } catch (error) {

        console.error(error);

        table.innerHTML = `

            <tr>

                <td colspan="6">
                    Unable to load students.
                </td>

            </tr>

        `;
    }
}


/* =========================================================
   TEACHERS
========================================================= */

async function teachersPage() {

    if (
        currentProfile.role !== "admin"
    ) {

        alert(
            "Only Admin can access Teachers."
        );

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

                    </tr>

                </thead>


                <tbody id="teachersTable">

                    <tr>

                        <td colspan="5">
                            Loading...
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>
    `;


    try {

        const snapshot =
            await db
                .collection("teachers")
                .get();


        const table =
            document.getElementById(
                "teachersTable"
            );


        if (snapshot.empty) {

            table.innerHTML = `

                <tr>

                    <td colspan="5">
                        No teachers found.
                    </td>

                </tr>

            `;

            return;
        }


        table.innerHTML = "";


        snapshot.forEach(doc => {

            const teacher =
                doc.data();


            table.innerHTML += `

                <tr>

                    <td>
                        ${escapeHTML(
                            teacher.id
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            teacher.name
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            teacher.subject
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            teacher.batch
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            teacher.phone
                        )}
                    </td>

                </tr>

            `;
        });

    } catch (error) {

        console.error(error);
    }
}


/* =========================================================
   TESTS
========================================================= */

async function testsPage() {

    document.getElementById("view").innerHTML = `

        <div class="topbar">

            <h1>Tests</h1>

        </div>


        <div class="card">

            <p>
                Tests will be stored in Firebase.
            </p>

        </div>
    `;
}


/* =========================================================
   ATTENDANCE
========================================================= */

async function attendancePage() {

    document.getElementById("view").innerHTML = `

        <div class="topbar">

            <h1>Attendance</h1>

        </div>


        <div class="card">

            <p>
                Attendance will be stored in Firebase.
            </p>

        </div>
    `;
}


/* =========================================================
   FEES
========================================================= */

async function feesPage() {

    if (
        currentProfile.role !== "admin"
    ) {

        alert(
            "Only Admin can access Fees."
        );

        return;
    }


    document.getElementById("view").innerHTML = `

        <div class="topbar">

            <h1>Fees</h1>

        </div>


        <div class="card">

            <p>
                Fees will be managed through Firestore.
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

            <h1>Homework</h1>

        </div>


        <div class="card">

            <p>
                Homework will be stored in Firebase.
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
                Your homework will appear here.
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

            <h1>Notices</h1>

        </div>


        <div class="card">

            <p>
                Notices will be stored in Firebase.
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
                Important notices will appear here.
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

            student =
                snapshot.docs[0].data();

        }

    } catch (error) {

        console.error(error);
    }


    view.innerHTML = `

        <div class="topbar">

            <div>

                <h1>
                    Student Dashboard
                </h1>

                <p class="muted">

                    Welcome,
                    ${escapeHTML(
                        student?.name ||
                        currentProfile.name
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
                        ? escapeHTML(
                            student.className || ""
                        )
                        : "Profile pending"
                    }

                </p>

            </div>


            <div class="card">

                <h3>Pending Fee</h3>

                <p>

                    ${
                        student
                        ? money(
                            Number(student.fees || 0) -
                            Number(student.paid || 0)
                        )
                        : "₹0"
                    }

                </p>

            </div>


            <div class="card">

                <h3>Attendance</h3>

                <p>
                    Available soon
                </p>

            </div>


            <div class="card">

                <h3>Results</h3>

                <p>
                    Available soon
                </p>

            </div>

        </div>
    `;
}


/* =========================================================
   STUDENT RESULTS
========================================================= */

async function studentResultsPage() {

    if (
        currentProfile.role !== "student"
    ) return;


    document.getElementById("view").innerHTML = `

        <div class="topbar">

            <h1>
                My Results
            </h1>

        </div>


        <div class="card">

            <p>
                Your results will appear here.
            </p>

        </div>
    `;
}


/* =========================================================
   STUDENT ATTENDANCE
========================================================= */

async function studentAttendancePage() {

    if (
        currentProfile.role !== "student"
    ) return;


    document.getElementById("view").innerHTML = `

        <div class="topbar">

            <h1>
                My Attendance
            </h1>

        </div>


        <div class="card">

            <p>
                Your attendance will appear here.
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

        alert(
            "Unable to logout."
        );
    }
}


/* =========================================================
   START APPLICATION
========================================================= */

auth.onAuthStateChanged(
    async user => {

        if (!user) {

            loginPage();

            return;
        }


        currentUser = user;


        try {

            const snap =
                await db
                    .collection("users")
                    .doc(user.uid)
                    .get();


            if (snap.exists) {

                currentProfile =
                    snap.data();


                app(
                    currentProfile.role
                );

            } else {

                loginPage(
                    "Account setup is incomplete."
                );
            }

        } catch (error) {

            console.error(error);

            loginPage(
                "Unable to load your account."
            );
        }

    }
);
