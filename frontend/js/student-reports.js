const menuToggle =
    document.getElementById("menuToggle");

const sidebar =
    document.getElementById("sidebar");

const getAuthToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");
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

            const attendanceResponse =
                await fetch(
                    `${API_BASE_URL}/api/attendance/my-attendance`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const attendance =
                await attendanceResponse.json();

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
                percentageData.attendancePercentage;

            document.getElementById(
                "totalClasses"
            ).textContent =
                percentageData.totalClasses;

            document.getElementById(
                "presentClasses"
            ).textContent =
                percentageData.presentClasses;

            document.getElementById(
                "absentClasses"
            ).textContent =
                percentageData.totalClasses -
                percentageData.presentClasses;

            const subjects = {};

            attendance.forEach(record => {

                if (!subjects[record.subject]) {

                    subjects[record.subject] = {
                        total: 0,
                        present: 0,
                    };

                }

                subjects[record.subject].total++;

                if (
                    record.status ===
                    "Present"
                ) {

                    subjects[
                        record.subject
                    ].present++;

                }

            });

            const tbody =
                document.getElementById(
                    "reportTableBody"
                );

            tbody.innerHTML = "";

            let bestSubject = "";
            let weakestSubject = "";

            let highest = -1;
            let lowest = 101;

            const chartLabels = [];
            const chartData = [];

            Object.entries(subjects)
                .forEach(
                    ([subject, data]) => {

                        const percentage =
                            (
                                data.present /
                                data.total
                            ) * 100;

                        const absent =
                            data.total -
                            data.present;

                        tbody.innerHTML += `
<tr>
<td>${subject}</td>
<td>${data.total}</td>
<td>${data.present}</td>
<td>${absent}</td>
<td>${percentage.toFixed(1)}%</td>
</tr>
`;

                        chartLabels.push(
                            subject
                        );

                        chartData.push(
                            percentage.toFixed(1)
                        );

                        if (
                            percentage >
                            highest
                        ) {

                            highest =
                                percentage;

                            bestSubject =
                                `${subject} (${percentage.toFixed(1)}%)`;

                        }

                        if (
                            percentage <
                            lowest
                        ) {

                            lowest =
                                percentage;

                            weakestSubject =
                                `${subject} (${percentage.toFixed(1)}%)`;

                        }

                    }
                );

            document.getElementById(
                "bestSubject"
            ).innerHTML =
                `<span class="good-badge">${bestSubject}</span>`;

            document.getElementById(
                "weakestSubject"
            ).innerHTML =
                `<span class="warning-badge">${weakestSubject}</span>`;

            let status = "";
            let statusClass = "";

            const overallPercentage =
                parseFloat(
                    percentageData.attendancePercentage
                );

            if (overallPercentage >= 85) {

                status = "Excellent";
                statusClass = "good-badge";

            }
            else if (overallPercentage >= 75) {

                status = "Warning";
                statusClass = "warning-badge";

            }
            else {

                status = "Critical";
                statusClass = "danger-badge";

            }

            document.getElementById(
                "attendanceStatus"
            ).innerHTML =
                `<span class="${statusClass}">${status}</span>`;

            document.getElementById(
                "attendanceStatus"
            ).textContent =
                status;

            new Chart(
                document.getElementById(
                    "attendanceChart"
                ),
                {
                    type: "bar",

                    data: {
                        labels:
                            chartLabels,

                        datasets: [
                            {
                                label:
                                    "Attendance %",
                                data:
                                    chartData,
                            },
                        ],
                    },

                    options: {
                        responsive:
                            true,

                        scales: {
                            y: {
                                beginAtZero:
                                    true,

                                max: 100,
                            },
                        },
                    },
                }
            );

        } catch (error) {

            console.error(error);

            alert(
                "Failed to load reports."
            );

        }
    }
);
