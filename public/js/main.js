// ======================================================
// BOWER COMPANY
// MAIN JAVASCRIPT
// public/js/main.js
// ======================================================


// ======================================================
// WAIT FOR PAGE TO LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ==================================================
        // FIND SCROLL ANIMATION ELEMENTS
        // ==================================================
        //
        // These classes are defined in:
        //
        // public/css/home.css
        //
        // .reveal-left
        // .reveal-right
        //
        // ==================================================

        const revealElements =
            document.querySelectorAll(
                ".reveal-left, .reveal-right"
            );


        // ==================================================
        // SAFETY CHECK
        // ==================================================
        //
        // If this page does not contain reveal elements,
        // there is nothing else to do.
        //
        // ==================================================

        if (revealElements.length === 0) {

            return;

        }


        // ==================================================
        // FALLBACK FOR OLDER BROWSERS
        // ==================================================
        //
        // If IntersectionObserver is unavailable, show
        // everything instead of leaving the page invisible.
        //
        // ==================================================

        if (!("IntersectionObserver" in window)) {

            revealElements.forEach(
                function (element) {

                    element.classList.add(
                        "active"
                    );

                }
            );


            return;

        }


        // ==================================================
        // CREATE SCROLL OBSERVER
        // ==================================================
        //
        // The CSS starts the elements with:
        //
        // opacity: 0
        //
        // and moves them off screen.
        //
        // When JavaScript adds:
        //
        // active
        //
        // home.css animates them into their normal position.
        //
        // ==================================================

        const revealObserver =
            new IntersectionObserver(

                function (entries, observer) {

                    entries.forEach(
                        function (entry) {


                            // ==================================
                            // ELEMENT ENTERED THE SCREEN
                            // ==================================

                            if (entry.isIntersecting) {


                                // ==============================
                                // ADD CSS ACTIVE CLASS
                                // ==============================

                                entry.target.classList.add(
                                    "active"
                                );


                                // ==============================
                                // STOP WATCHING THIS ELEMENT
                                // ==============================
                                //
                                // This makes the animation happen
                                // only once.
                                //
                                // ==============================

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },


                // ==============================================
                // OBSERVER SETTINGS
                // ==============================================

                {

                    // Start slightly before the element
                    // gets deep into the viewport.

                    threshold: 0.10,


                    // Trigger a little early so the animation
                    // feels smooth while scrolling.

                    rootMargin:
                        "0px 0px -40px 0px"

                }

            );


        // ==================================================
        // WATCH EVERY REVEAL ELEMENT
        // ==================================================

        revealElements.forEach(
            function (element) {

                revealObserver.observe(
                    element
                );

            }
        );


    }
);