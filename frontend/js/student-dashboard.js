const menuToggle =
    document.getElementById("menuToggle");

const sidebar =
    document.getElementById("sidebar");

const getAuthToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
};
const API_BASE_URL = window.PRESENT_MAM_API_BASE_URL;


menuToggle.addEventListener("click", () => {

    sidebar.classList.toggle("collapsed");

});

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const token = getAuthToken();

        if (!token) {

            window.location.href =
                "login.html";

            return;
        }

        try {

            // Fetch student profile
            const profileResponse =
                await fetch(
                    `${API_BASE_URL}/api/students/profile`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const student =
                await profileResponse.json();

            document.getElementById(
                "studentNameTop"
            ).textContent =
                student.name;

            document.getElementById(
                "welcomeName"
            ).textContent =
                student.name;

            document.getElementById(
                "studentName"
            ).textContent =
                student.name;

            document.getElementById(
                "rollNumber"
            ).textContent =
                student.rollNumber;

            document.getElementById(
                "department"
            ).textContent =
                student.department;

            document.getElementById(
                "semester"
            ).textContent =
                student.semester;


            // Fetch percentage
            const percentageResponse =
                await fetch(
                    `${API_BASE_URL}/api/attendance/percentage`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const percentageData =
                await percentageResponse.json();

            document.getElementById(
                "attendancePercentage"
            ).textContent =
                percentageData.attendancePercentage;

        } catch (error) {

            console.error(error);

            alert(
                "Session expired. Please login again."
            );

            clearSession();

            window.location.href =
                "login.html";
        }
    }
);


const counters =
    document.querySelectorAll(".counter");

counters.forEach(counter => {

    const target =
        +counter.dataset.target;

    let count = 0;

    const increment =
        target / 50;

    const updateCounter = () => {

        if(count < target){

            count += increment;

            counter.textContent =
                Math.ceil(count);

            setTimeout(updateCounter,30);

        }else{

            counter.textContent =
                target;

        }

    };

    updateCounter();

});

const logoutBtn =
    document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", (e) => {

    e.preventDefault();

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );

    if (confirmLogout) {

        clearSession();

        window.location.href =
            "login.html";
    }
});
