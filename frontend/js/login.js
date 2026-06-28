const studentBtn = document.getElementById("studentBtn");
const teacherBtn = document.getElementById("teacherBtn");
const loginModeBtn = document.getElementById("loginModeBtn");
const signupModeBtn = document.getElementById("signupModeBtn");
const helperToggle = document.getElementById("helperToggle");
const authHelper = document.getElementById("authHelper");

const slider = document.querySelector(".slider");
const loginCardTitle = document.querySelector(".login-card h2");
const loginText = document.querySelector(".login-text");

const identifier = document.getElementById("identifier");
const identifierIcon = document.getElementById("identifierIcon");
const password = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");
const loginBtn = document.getElementById("loginBtn");
const loginForm = document.getElementById("loginForm");
const options = document.querySelector(".options");
const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
const resetModal = document.getElementById("resetModal");
const resetCloseBtn = document.getElementById("resetCloseBtn");
const resetForm = document.getElementById("resetForm");
const resetEmail = document.getElementById("resetEmail");
const resetOtp = document.getElementById("resetOtp");
const resetPassword = document.getElementById("resetPassword");
const resetConfirmPassword = document.getElementById("resetConfirmPassword");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const otpStatus = document.getElementById("otpStatus");

const signupFields = document.querySelectorAll(".signup-field");
const studentFields = document.querySelectorAll(".student-field");
const teacherFields = document.querySelectorAll(".teacher-field");

const fields = {
    name: document.getElementById("name"),
    rollNumber: document.getElementById("rollNumber"),
    department: document.getElementById("department"),
    semester: document.getElementById("semester"),
    subjects: document.getElementById("subjects"),
};

let currentMode = "login";
const API_BASE_URL = window.PRESENT_MAM_API_BASE_URL;

const rememberedLoginKey = "presentMamRememberedLogin";

const isStudentRole = () => studentBtn.classList.contains("active");

const setRequired = (elements, required) => {
    elements.forEach((element) => {
        const input = element.querySelector("input");

        if (input) {
            input.required = required;
        }
    });
};

const clearSignupFields = () => {
    Object.values(fields).forEach((field) => {
        field.value = "";
    });
};

const updateView = () => {
    const isStudent = isStudentRole();
    const isSignup = currentMode === "signup";
    const role = isStudent ? "Student" : "Teacher";

    document.body.classList.toggle("signup-mode", isSignup);
    document.body.classList.toggle("teacher-role", !isStudent);

    loginModeBtn.classList.toggle("active", !isSignup);
    signupModeBtn.classList.toggle("active", isSignup);

    loginCardTitle.textContent = isSignup
        ? "Create Account"
        : "Welcome Back";

    loginText.textContent = isSignup
        ? `Sign up as ${role}`
        : "Login to your account";

    identifier.placeholder = isStudent
        ? "Enter your email"
        : "Enter your college email";

    identifier.type = "email";
    identifierIcon.className = "fa-solid fa-envelope";

    loginBtn.textContent = isSignup
        ? `Sign Up as ${role}`
        : `Login as ${role}`;

    options.style.display = isSignup ? "none" : "flex";

    authHelper.firstChild.textContent = isSignup
        ? "Already have an account? "
        : "Don't have an account? ";

    helperToggle.textContent = isSignup
        ? "Login"
        : "Create one";

    signupFields.forEach((field) => {
        field.classList.toggle("show", isSignup);
    });

    studentFields.forEach((field) => {
        field.classList.toggle("show", isSignup && isStudent);
    });

    teacherFields.forEach((field) => {
        field.classList.toggle("show", isSignup && !isStudent);
    });

    setRequired(signupFields, false);

    if (isSignup) {
        setRequired([
            document.querySelector("#name").closest(".signup-field"),
            document.querySelector("#department").closest(".signup-field"),
        ], true);

        setRequired(isStudent ? studentFields : teacherFields, true);
    }
};

const setMode = (mode) => {
    currentMode = mode;
    clearSignupFields();
    updateView();
};

const applyRole = (role) => {
    if (role === "teacher") {
        slider.classList.add("teacher");
        teacherBtn.classList.add("active");
        studentBtn.classList.remove("active");
    } else {
        slider.classList.remove("teacher");
        studentBtn.classList.add("active");
        teacherBtn.classList.remove("active");
    }

    updateView();
};

const loadRememberedLogin = () => {
    const rememberedLogin = JSON.parse(
        localStorage.getItem(rememberedLoginKey) || "null"
    );

    if (!rememberedLogin) {
        return;
    }

    rememberMe.checked = true;
    identifier.value = rememberedLogin.email || "";
    applyRole(rememberedLogin.role);
};

const saveRememberedLogin = (isStudent) => {
    if (rememberMe.checked) {
        localStorage.setItem(
            rememberedLoginKey,
            JSON.stringify({
                email: identifier.value.trim(),
                role: isStudent ? "student" : "teacher",
            })
        );
        return;
    }

    localStorage.removeItem(rememberedLoginKey);
};

const saveSession = (token, isStudent) => {
    const storage = rememberMe.checked ? localStorage : sessionStorage;
    const otherStorage = rememberMe.checked ? sessionStorage : localStorage;
    const role = isStudent ? "student" : "teacher";

    otherStorage.removeItem("token");
    otherStorage.removeItem("role");

    storage.setItem("token", token);
    storage.setItem("role", role);
};

const openResetModal = () => {
    resetEmail.value = identifier.value.trim();
    resetOtp.value = "";
    resetPassword.value = "";
    resetConfirmPassword.value = "";
    otpStatus.textContent = "";

    resetModal.classList.add("show");
    resetModal.setAttribute("aria-hidden", "false");

    setTimeout(() => {
        (resetEmail.value ? sendOtpBtn : resetEmail).focus();
    }, 0);
};

const closeResetModal = () => {
    resetModal.classList.remove("show");
    resetModal.setAttribute("aria-hidden", "true");
};

studentBtn.addEventListener("click", () => {
    applyRole("student");
});

teacherBtn.addEventListener("click", () => {
    applyRole("teacher");
});

loginModeBtn.addEventListener("click", () => setMode("login"));
signupModeBtn.addEventListener("click", () => setMode("signup"));

helperToggle.addEventListener("click", () => {
    setMode(currentMode === "login" ? "signup" : "login");
});

forgotPasswordBtn.addEventListener("click", openResetModal);
resetCloseBtn.addEventListener("click", closeResetModal);

resetModal.addEventListener("click", (event) => {
    if (event.target === resetModal) {
        closeResetModal();
    }
});

sendOtpBtn.addEventListener("click", async () => {
    const isStudent = isStudentRole();
    const email = resetEmail.value.trim();

    if (!email) {
        alert("Please enter your registered email first.");
        resetEmail.focus();
        return;
    }

    const endpoint = isStudent
        ? `${API_BASE_URL}/api/students/request-reset-otp`
        : `${API_BASE_URL}/api/teachers/request-reset-otp`;

    sendOtpBtn.disabled = true;
    sendOtpBtn.textContent = "Sending...";
    otpStatus.textContent = "";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        otpStatus.textContent = data.devOtp
            ? `OTP: ${data.devOtp}`
            : data.message;
        resetOtp.focus();
    } catch (error) {
        console.error(error);
        alert("Unable to send OTP.");
    } finally {
        sendOtpBtn.disabled = false;
        sendOtpBtn.textContent = "Send OTP";
    }
});

const submitLogin = async (isStudent) => {
    const endpoint = isStudent
        ? `${API_BASE_URL}/api/students/login`
        : `${API_BASE_URL}/api/teachers/login`;

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: identifier.value.trim(),
            password: password.value.trim(),
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.message);
        return;
    }

    saveSession(data.token, isStudent);
    saveRememberedLogin(isStudent);

    alert("Login successful!");

    window.location.href = isStudent
        ? "student-dashboard.html"
        : "teacher-dashboard.html";
};

const submitSignup = async (isStudent) => {
    const endpoint = isStudent
        ? `${API_BASE_URL}/api/students/register`
        : `${API_BASE_URL}/api/teachers/register`;

    const payload = {
        name: fields.name.value.trim(),
        email: identifier.value.trim(),
        password: password.value.trim(),
        department: fields.department.value.trim(),
    };

    if (isStudent) {
        payload.rollNumber = fields.rollNumber.value.trim();
        payload.semester = Number(fields.semester.value);
    } else {
        payload.subjects = fields.subjects.value
            .split(",")
            .map((subject) => subject.trim())
            .filter(Boolean);
    }

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.message);
        return;
    }

    alert(`${isStudent ? "Student" : "Teacher"} account created. Please login.`);

    password.value = "";
    setMode("login");
};

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isStudent = isStudentRole();

    try {
        if (currentMode === "signup") {
            await submitSignup(isStudent);
        } else {
            await submitLogin(isStudent);
        }
    } catch (error) {
        console.error(error);
        alert("Unable to connect to server.");
    }
});

resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isStudent = isStudentRole();

    if (resetPassword.value !== resetConfirmPassword.value) {
        alert("Passwords do not match.");
        return;
    }

    const endpoint = isStudent
        ? `${API_BASE_URL}/api/students/reset-password`
        : `${API_BASE_URL}/api/teachers/reset-password`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: resetEmail.value.trim(),
                otp: resetOtp.value.trim(),
                password: resetPassword.value.trim(),
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Password updated. You can login now.");

        identifier.value = resetEmail.value.trim();
        password.value = "";
        closeResetModal();
        setMode("login");
    } catch (error) {
        console.error(error);
        alert("Unable to connect to server.");
    }
});

updateView();
loadRememberedLogin();
