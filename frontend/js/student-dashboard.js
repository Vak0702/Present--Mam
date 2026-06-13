const menuToggle =
    document.getElementById("menuToggle");

const sidebar =
    document.getElementById("sidebar");


menuToggle.addEventListener("click", () => {

    sidebar.classList.toggle("collapsed");

});


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
