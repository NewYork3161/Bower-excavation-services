document.addEventListener("DOMContentLoaded", () => {

    const elements = document.querySelectorAll(
        ".reveal-left, .reveal-right"
    );


    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("active");

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.25
    });



    elements.forEach(element => {

        observer.observe(element);

    });

});