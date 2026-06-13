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

    identifier.placeholder = "Enter your roll number";

    identifier.type = "text";

    identifierIcon.className =
        "fa-solid fa-id-card";

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