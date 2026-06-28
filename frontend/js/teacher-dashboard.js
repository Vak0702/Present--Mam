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

            const response =
                await fetch(
                    `${API_BASE_URL}/api/students`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const students =
                await response.json();

            const tbody =
                document.getElementById(
                    "studentsTableBody"
                );

            tbody.innerHTML = "";

            students.forEach(student => {

                tbody.innerHTML += `
    <tr data-student-id="${student._id}">
        <td>${student.rollNumber}</td>

        <td>${student.name}</td>

        <td>
            <div class="status-buttons">

                <button
                    class="present-btn active"
                    data-status="Present">

                    Present

                </button>

                <button
                    class="absent-btn"
                    data-status="Absent">

                    Absent

                </button>

            </div>
        </td>
    </tr>
`;
            });

        } catch (error) {

            console.error(error);

            alert(
                "Unable to load students."
            );
        }
    }
);

document.addEventListener(
    "click",
    (e) => {

        if (
            e.target.matches(
                ".present-btn, .absent-btn"
            )
        ) {

            const buttons =
                e.target.parentElement
                    .querySelectorAll(
                        "button"
                    );

            buttons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });

            e.target.classList.add(
                "active"
            );
        }
    }
);


const submitBtn =
    document.getElementById(
        "submitAttendanceBtn"
    );

submitBtn.addEventListener(
    "click",
    async () => {

        const token = getAuthToken();

        const subject =
            document.getElementById(
                "subjectSelect"
            ).value;

        const rows =
            document.querySelectorAll(
                "#studentsTableBody tr"
            );

        try {

            for (const row of rows) {

                const studentId =
                    row.dataset.studentId;

                const activeButton =
                    row.querySelector(
                        ".active"
                    );

                const status =
                    activeButton.dataset.status;

                const response = await fetch(
                    `${API_BASE_URL}/api/attendance/mark`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`,
                        },

                        body: JSON.stringify({
                            student:
                                studentId,

                            subject,

                            date:
                                new Date()
                                    .toISOString()
                                    .split("T")[0],

                            status,
                        }),
                    }
                );

                if (!response.ok) {

                    const errorData =
                        await response.json();

                    throw new Error(
                        errorData.message
                    );
                };
            }

            alert(
                "Attendance submitted successfully!"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Failed to submit attendance."
            );
        }
    }
);

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
