const menuToggle =
    document.getElementById("menuToggle");

const sidebar =
    document.getElementById("sidebar");


menuToggle.addEventListener("click", () => {

    sidebar.classList.toggle("collapsed");

});

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            window.location.href =
                "login.html";

            return;
        }

        try {

            // Fetch student profile
            const profileResponse =
                await fetch(
                    "http://localhost:5000/api/students/profile",
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
                    "http://localhost:5000/api/attendance/percentage",
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

            localStorage.clear();

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
