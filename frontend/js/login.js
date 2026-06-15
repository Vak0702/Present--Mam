const studentBtn = document.getElementById("studentBtn");
const teacherBtn = document.getElementById("teacherBtn");

const slider = document.querySelector(".slider");

const identifier = document.getElementById("identifier");
const identifierIcon = document.getElementById("identifierIcon");

const loginBtn = document.getElementById("loginBtn");


studentBtn.addEventListener("click", () => {

    slider.classList.remove("teacher");

    studentBtn.classList.add("active");
    teacherBtn.classList.remove("active");

    identifier.placeholder = "Enter your email";

    identifier.type = "email";

    identifierIcon.className =
        "fa-solid fa-envelop";

    loginBtn.textContent =
        "Login as Student";
});


teacherBtn.addEventListener("click", () => {

    slider.classList.add("teacher");

    teacherBtn.classList.add("active");
    studentBtn.classList.remove("active");

    identifier.placeholder =
        "Enter your college email";

    identifier.type = "email";

    identifierIcon.className =
        "fa-solid fa-envelope";

    loginBtn.textContent =
        "Login as Teacher";
});

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = identifier.value.trim();
    const password = document
        .getElementById("password")
        .value
        .trim();

    const isStudent =
        studentBtn.classList.contains("active");

    const endpoint = isStudent
        ? "http://localhost:5000/api/students/login"
        : "http://localhost:5000/api/teachers/login";

    try {
        const response = await fetch(endpoint, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        // Save token
        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "role",
            isStudent ? "student" : "teacher"
        );

        alert("Login successful!");

        // Redirect
        if (isStudent) {
            window.location.href =
                "student-dashboard.html";
        } else {
            window.location.href =
                "teacher-dashboard.html";
        }

    } catch (error) {
        console.error(error);

        alert(
            "Unable to connect to server."
        );
    }
});