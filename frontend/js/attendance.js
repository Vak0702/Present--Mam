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

            // Fetch attendance records
            const response =
                await fetch(
                    `${API_BASE_URL}/api/attendance/my-attendance`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const records =
                await response.json();

            const tableBody =
                document.getElementById(
                    "attendanceTableBody"
                );

            tableBody.innerHTML = "";

            const subjects = {};

            records.forEach(record => {

                const subject =
                    record.subject;

                if (!subjects[subject]) {

                    subjects[subject] = {
                        total: 0,
                        present: 0,
                    };
                }

                subjects[subject].total++;

                if (
                    record.status ===
                    "Present"
                ) {

                    subjects[
                        subject
                    ].present++;
                }
            });

            Object.keys(subjects)
                .forEach(subject => {

                    const total =
                        subjects[
                            subject
                        ].total;

                    const present =
                        subjects[
                            subject
                        ].present;

                    const absent =
                        total - present;

                    const percentage =
                        (
                            (
                                present /
                                total
                            ) * 100
                        ).toFixed(2);

                    tableBody.innerHTML += `
                        <tr>

                            <td>${subject}</td>

                            <td>${total}</td>

                            <td>${present}</td>

                            <td>${absent}</td>

                            <td>${percentage}%</td>

                        </tr>
                    `;
                });

            // Fetch overall percentage
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
                "overallAttendance"
            ).textContent =
                percentageData
                    .attendancePercentage;

        } catch (error) {

            console.error(error);

            alert(
                "Unable to load attendance."
            );
        }
    }
);

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

logoutBtn.addEventListener(
    "click",
    (e) => {

        e.preventDefault();

        clearSession();

        window.location.href =
            "login.html";
    }
);
