const navLinks =
    document.querySelectorAll('a[href^="#"]');

navLinks.forEach(link => {

    link.addEventListener("click", e => {

        e.preventDefault();

        const target =
            document.querySelector(
                link.getAttribute("href")
            );

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});

const revealElements =
    document.querySelectorAll(
        ".feature-card, .role-card"
    );

const revealOnScroll = () => {

    revealElements.forEach(element => {

        const windowHeight =
            window.innerHeight;

        const elementTop =
            element.getBoundingClientRect().top;

        const revealPoint = 100;

        if(elementTop < windowHeight - revealPoint){

            element.classList.add("active");

        }

    });

};

window.addEventListener(
    "scroll",
    revealOnScroll
);

revealOnScroll();

const navbar =
    document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if(window.scrollY > 50){

        navbar.classList.add("scrolled");

    }else{

        navbar.classList.remove("scrolled");

    }

});