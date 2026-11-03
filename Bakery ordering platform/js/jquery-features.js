
/*
  SWEET CRUMB BAKERY
  ASSIGNMENT 6 — jQuery
  Tasks 0–9
*/

$(document).ready(function () {

    // TASK 0 — jQuery Setup
    console.log("jQuery is ready!");


    // TASK 4 — Scroll Progress Bar
    $("body").prepend(
        '<div id="scrollProgress"></div>'
    );

    function updateScrollProgress() {
        const scrollTop = $(window).scrollTop();
        const maxScroll =
            $(document).height() - $(window).height();

        const progress = maxScroll > 0
            ? Math.min(100, (scrollTop / maxScroll) * 100)
            : 100;

        $("#scrollProgress").css("width", progress + "%");
    }

    $(window).on("scroll resize", updateScrollProgress);
    updateScrollProgress();


    // TASK 7 — Toast Notification
    $("body").append(
        '<div id="bakeryToast" class="bakery-toast" role="status" aria-live="polite"></div>'
    );

    let toastTimer;

    window.showBakeryToast = function (message) {
        clearTimeout(toastTimer);

        $("#bakeryToast")
            .stop(true, true)
            .text(message)
            .fadeIn(300);

        toastTimer = setTimeout(function () {
            $("#bakeryToast").fadeOut(500);
        }, 2500);
    };


    // Reusable Search Highlighting Function
    function highlightText($element, keyword) {
        if (!$element.length) return;

        let original = $element.data("original-text");

        if (original === undefined) {
            original = $element.text();
            $element.data("original-text", original);
        }

        $element.empty();

        if (!keyword) {
            $element.text(original);
            return;
        }

        const lowerText = original.toLowerCase();
        const lowerKeyword = keyword.toLowerCase();

        let start = 0;
        let index;

        while (
            (index = lowerText.indexOf(
                lowerKeyword, start
            )) !== -1
        ) {
            $element.append(
                document.createTextNode(
                    original.slice(start, index)
                )
            );

            $("<mark>")
                .addClass("search-highlight")
                .text(original.slice(
                    index,
                    index + keyword.length
                ))
                .appendTo($element);

            start = index + keyword.length;
        }

        $element.append(
            document.createTextNode(original.slice(start))
        );
    }


    // TASK 1 — Real-time Search
    // TASK 2 — Autocomplete
    // TASK 3 — Search Highlighting

    if ($("#searchInput").length) {

        const productNames = $("#product-list .card-title")
            .map(function () {
                return $(this).text().trim();
            }).get();

        function searchProducts() {
            const keyword = $("#searchInput")
                .val().trim();

            const lowerKeyword = keyword.toLowerCase();
            let count = 0;

            $("#product-list .product-card-item").each(
                function () {
                    const $card = $(this);
                    const $title = $card.find(".card-title").first();
                    const $description =
                        $card.find(".card-text").first();

                    const title = $title.data("original-text")
                        ?? $title.text();

                    const description =
                        $description.data("original-text")
                        ?? $description.text();

                    const text = (
                        title + " " + description
                    ).toLowerCase();

                    const matches = text.includes(lowerKeyword);

                    $card.toggle(matches);

                    if (matches) count++;

                    highlightText($title, keyword);
                    highlightText($description, keyword);
                }
            );

            $("#searchCount").text(
                count + " matching products"
            );

            const $suggestions = $("#suggestions").empty();

            if (keyword !== "") {
                productNames
                    .filter(function (name) {
                        return name.toLowerCase()
                            .includes(lowerKeyword);
                    })
                    .slice(0, 6)
                    .forEach(function (name) {
                        $("<button>", {
                            type: "button",
                            class: "bakery-suggestion",
                            role: "option"
                        })
                        .text(name)
                        .appendTo($suggestions);
                    });
            }
        }

        $("#searchInput").on("input keyup", searchProducts);

        $(".filter-buttons [data-filter]").on(
            "click",
            function () {
                searchProducts();
            }
        );

        $(document).on(
            "click",
            ".bakery-suggestion",
            function () {
                const selected = $(this).text();

                $(".filter-buttons [data-filter='all']")
                    .trigger("click");

                $("#searchInput").val(selected);
                searchProducts();

                $("#suggestions").empty();

                window.showBakeryToast(
                    "Selected: " + selected
                );
            }
        );

        $("#searchInput").on("keydown", function (event) {
            if (event.key === "Escape") {
                $("#suggestions").empty();
            }
        });

        $(document).on("click", function (event) {
            if (
                !$(event.target).closest(
                    ".bakery-search-area"
                ).length
            ) {
                $("#suggestions").empty();
            }
        });

        searchProducts();
    }


    // TASK 3 — FAQ Search Highlighting
    if ($("#faqSearch").length) {

        const $faqItems = $("#faq .faq-item");

        $faqItems.each(function () {
            const $question = $(this).find(".faq-question");
            const $answer = $(this).find(".faq-answer");

            const questionText = $question.contents()
                .filter(function () {
                    return this.nodeType === 3;
                })
                .map(function () {
                    return this.nodeValue;
                })
                .get()
                .join(" ")
                .trim();

            $question.data("original-question", questionText);
            $answer.data("original-text", $answer.text());
        });

        $("#faqSearch").on("input", function () {
            const keyword = $(this).val().trim();
            let count = 0;

            $faqItems.each(function () {
                const $item = $(this);
                const $question = $item.find(".faq-question");
                const $answer = $item.find(".faq-answer");

                const question =
                    $question.data("original-question") || "";

                const answer =
                    $answer.data("original-text") || "";

                const matches = (
                    question + " " + answer
                ).toLowerCase().includes(
                    keyword.toLowerCase()
                );

                $item.toggle(matches);

                if (matches) count++;

                $question.find(".faq-search-label").remove();

                $question.contents().filter(function () {
                    return this.nodeType === 3;
                }).remove();

                const $label = $("<span>")
                    .addClass("faq-search-label");

                $label.data("original-text", question);

                highlightText($label, keyword);
                $question.prepend($label);

                highlightText($answer, keyword);
            });

            $("#faqSearchCount").text(
                count + " matching FAQs"
            );
        });
    }


    // TASK 5 — Animated Number Counter
    let counterStarted = false;

    function startCounter() {
        const $section = $("#bakery-statistics");

        if (!$section.length || counterStarted) return;

        const sectionTop =
            $section[0].getBoundingClientRect().top;

        if (sectionTop > window.innerHeight) return;

        counterStarted = true;

        $(".stat-number").each(function () {
            const $counter = $(this);

            const target = Number(
                $counter.attr("data-target")
            );

            $({ value: 0 }).animate(
                { value: target },
                {
                    duration: 1800,

                    step: function (value) {
                        $counter.text(Math.floor(value));
                    },

                    complete: function () {
                        $counter.text(target);
                    }
                }
            );
        });
    }

    $(window).on("scroll resize", startCounter);
    startCounter();


    // TASK 6 — Loading Spinner on Submit
    // Works after validation in the original script.js

    $("#order-form, #contact-form").on("submit", function () {
        const $form = $(this);
        const $button =
            $form.find('button[type="submit"]');

        if (!$button.length || $button.prop("disabled")) {
            return;
        }

        if ($form.find(".is-invalid").length) {
            return;
        }

        if (
            this.id === "order-form" &&
            $("#order-success").prop("hidden")
        ) {
            return;
        }

        const oldText = $button.html();

        $button.prop("disabled", true).html(
            '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Please wait...'
        );

        setTimeout(function () {
            $button.prop("disabled", false).html(oldText);

            window.showBakeryToast(
                "Form submitted successfully! (Demo)"
            );
        }, 1500);
    });


    // TASK 8 — Copy to Clipboard
    $("#copyEmailBtn").on("click", async function () {
        const email = $("#bakeryEmail").text().trim();
        const $button = $(this);

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(email);
            } else {
                const $temp = $("<textarea>")
                    .val(email)
                    .appendTo("body");

                $temp[0].select();

                const success = document.execCommand("copy");
                $temp.remove();

                if (!success) {
                    throw new Error("Copy failed");
                }
            }

            $button.text("✓ Copied!")
                .attr("title", "Copied to clipboard!");

            $("#copyEmailTooltip").text(
                "Copied to clipboard!"
            );

            window.showBakeryToast(
                "Email copied to clipboard!"
            );

            setTimeout(function () {
                $button.text("Copy email");
                $("#copyEmailTooltip").text("");
            }, 2000);

        } catch (error) {
            window.showBakeryToast(
                "Unable to copy email"
            );
        }
    });


    // TASK 9 — Image Lazy Loading
    function loadLazyImages() {
        $("img[data-src]").each(function () {
            const position =
                this.getBoundingClientRect().top;

            if (position < window.innerHeight + 250) {
                const $image = $(this);

                $image.attr(
                    "src",
                    $image.attr("data-src")
                );

                $image.removeAttr("data-src");
            }
        });
    }

    $(window).on(
        "scroll resize load",
        loadLazyImages
    );

    loadLazyImages();

});


/* ==========================================
   SWEET CRUMB BAKERY
   DAY / NIGHT THEME FIX
   Original Beige Design
   ========================================== */

(function () {
    "use strict";

    const themeKey = "bakery-theme";

    function setBakeryTheme(theme) {
        const isDark = theme === "dark";

        document.body.classList.toggle(
            "dark-theme",
            isDark
        );

        document.body.style.backgroundColor =
            isDark ? "#2c211c" : "#fffaf4";

        document.body.style.color =
            isDark ? "#f5e9df" : "#4b3428";

        document.querySelectorAll(
            "#theme-toggle"
        ).forEach(function (button) {
            button.textContent = isDark
                ? "☀️ Day"
                : "🌙 Night";
        });

        localStorage.setItem(
            themeKey,
            isDark ? "dark" : "light"
        );
    }

    // Restore the beige theme the first time
    if (!localStorage.getItem("bakery-theme-fixed")) {
        localStorage.setItem("bakery-theme-fixed", "yes");
        localStorage.setItem(themeKey, "light");
    }

    // Apply the selected theme
    function initializeTheme() {
        setBakeryTheme(
            localStorage.getItem(themeKey) === "dark"
                ? "dark"
                : "light"
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeTheme
        );
    } else {
        initializeTheme();
    }

    // Handle clicks before old theme handlers
    window.addEventListener(
        "click",
        function (event) {
            const button = event.target.closest(
                "#theme-toggle"
            );

            if (!button) return;

            event.preventDefault();
            event.stopPropagation();

            const isDark = document.body.classList
                .contains("dark-theme");

            setBakeryTheme(
                isDark ? "light" : "dark"
            );
        },
        true
    );

})();
