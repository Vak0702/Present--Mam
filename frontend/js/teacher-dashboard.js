const menuToggle =
    document.getElementById("menuToggle");

const sidebar =
    document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {

    sidebar.classList.toggle("collapsed");

});

const statusGroups =
    document.querySelectorAll(".status-buttons");

statusGroups.forEach(group => {

    const buttons =
        group.querySelectorAll("button");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn => {

                btn.classList.remove("active");

            });

            button.classList.add("active");

        });

    });

});