
/*
  SWEET CRUMB BAKERY
  Assignment 5 + Assignment 6
  Nurlankyzy Zhanshuak
  Srazhdin Yasmin
  Urinbay Nurgul
*/

$(document).ready(function () {
    console.log("jQuery is ready!");

    // TASK 0 - jQuery setup

    // TASK 7 - Toast notifications
    if (!$("#bakeryToast").length) {
        $("body").append(
            '<div id="bakeryToast" role="status" aria-live="polite"></div>'
        );
    }

    let toastTimer;

    function toast(message) {
        clearTimeout(toastTimer);

        $("#bakeryToast")
            .stop(true, true)
            .text(message)
            .fadeIn(250);

        toastTimer = setTimeout(function () {
            $("#bakeryToast").fadeOut(400);
        }, 2600);
    }


    // TASK 4 - Scroll progress bar
    if (!$("#scrollProgress").length) {
        $("body").prepend(
            '<div id="scrollProgress" aria-hidden="true"></div>'
        );
    }

    function updateProgress() {
        const available =
            $(document).height() - $(window).height();

        const percent = available > 0
            ? Math.min(100, $(window).scrollTop() / available * 100)
            : 100;

        $("#scrollProgress").css("width", percent + "%");
    }

    $(window).on("scroll resize", updateProgress);
    updateProgress();


    // ASSIGNMENT 5 - Day and Night Theme
    function applyTheme(dark) {
        $("body").toggleClass("dark-theme", dark);

        $("#theme-toggle").text(
            dark ? "☀️ Day" : "🌙 Night"
        );

        localStorage.setItem(
            "bakery-theme",
            dark ? "dark" : "light"
        );
    }

    applyTheme(
        localStorage.getItem("bakery-theme") === "dark"
    );

    $("#theme-toggle").on("click", function () {
        applyTheme(
            !$("body").hasClass("dark-theme")
        );
    });


    // TASK 3 - Search highlighting
    function highlight($element, search) {
        if (!$element.length) return;

        let original = $element.data("original-text");

        if (original === undefined) {
            original = $element.text();
            $element.data("original-text", original);
        }

        $element.empty();

        if (!search) {
            $element.text(original);
            return;
        }

        const lower = original.toLowerCase();
        const keyword = search.toLowerCase();

        let cursor = 0;
        let found;

        while (
            (found = lower.indexOf(keyword, cursor)) !== -1
        ) {
            $element.append(
                document.createTextNode(
                    original.slice(cursor, found)
                )
            );

            $("<mark>")
                .addClass("search-highlight")
                .text(
                    original.slice(
                        found,
                        found + search.length
                    )
                )
                .appendTo($element);

            cursor = found + search.length;
        }

        $element.append(
            document.createTextNode(
                original.slice(cursor)
            )
        );
    }


    // TASK 1 - Live product search
    // Products are already in menu.html
    let selectedCategory = "all";

    function filterProducts() {
        if (!$("#product-list").length) return;

        const searchText = (
            $("#searchInput").val() || ""
        ).trim().toLowerCase();

        let visibleCount = 0;

        $("#product-list .product-card-item").each(function () {
            const $product = $(this);
            const category = $product.attr("data-category");

            const $title = $product.find(".card-title").first();
            const $description = $product.find(".card-text").first();

            const title = $title.data("original-text") ??
                $title.text();

            const description = $description.data("original-text") ??
                $description.text();

            const productText = (
                title + " " + description
            ).toLowerCase();

            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;

            const matchesSearch =
                productText.includes(searchText);

            const visible = matchesCategory && matchesSearch;

            $product.toggle(visible);

            if (visible) visibleCount++;

            highlight($title, searchText);
            highlight($description, searchText);
        });

        $("#searchCount").text(
            visibleCount + " matching products"
        );
    }


    // Category filtering
    $(".filter-buttons").on("click", "[data-filter]", function () {
        selectedCategory = $(this).data("filter");

        $(".filter-buttons [data-filter]")
            .removeClass("active btn-primary")
            .addClass("btn-outline-secondary");

        $(this)
            .removeClass("btn-outline-secondary")
            .addClass("active btn-primary");

        filterProducts();
    });


    // TASK 2 - Autocomplete
    $("#searchInput").on("input", function () {
        const searchValue = $(this)
            .val()
            .trim()
            .toLowerCase();

        filterProducts();

        const $suggestions = $("#suggestions").empty();

        if (!searchValue) return;

        $("#product-list .card-title").each(function () {
            const name = $(this).data("original-text") ??
                $(this).text();

            if (name.toLowerCase().includes(searchValue)) {
                $("<button>")
                    .attr("type", "button")
                    .attr("role", "option")
                    .addClass("bakery-suggestion")
                    .text(name)
                    .appendTo($suggestions);
            }
        });
    });

    $("#suggestions").on(
        "click",
        ".bakery-suggestion",
        function () {
            const selectedProduct = $(this).text();

            $("#searchInput").val(selectedProduct);
            selectedCategory = "all";

            $(".filter-buttons [data-filter]")
                .removeClass("active btn-primary")
                .addClass("btn-outline-secondary");

            $('.filter-buttons [data-filter="all"]')
                .removeClass("btn-outline-secondary")
                .addClass("active btn-primary");

            $("#suggestions").empty();
            filterProducts();

            toast("Selected: " + selectedProduct);
        }
    );

    $("#searchInput").on("keydown", function (event) {
        if (event.key === "Escape") {
            $("#suggestions").empty();
        }
    });

    $(document).on("click", function (event) {
        if (!$(event.target).closest(".bakery-search-area").length) {
            $("#suggestions").empty();
        }
    });

    filterProducts();


    // ASSIGNMENT 5 - Time greeting
    function timeGreeting() {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) return "Good morning";
        if (hour >= 12 && hour < 17) return "Good afternoon";
        if (hour >= 17 && hour < 22) return "Good evening";

        return "Hello night owl";
    }

    $("#time-greeting").text(
        timeGreeting() + "! Welcome to Sweet Crumb Bakery."
    );


    // ASSIGNMENT 5 - Personal greeting
    $("#name-greeting-form").on("submit", function (event) {
        event.preventDefault();

        const name = $("#user-name-input").val().trim();

        if (name.length < 2) {
            $("#personal-greeting").text(
                "Please enter at least 2 characters."
            );
            return;
        }

        $("#personal-greeting").text(
            timeGreeting() + ", " + name +
            "! Enjoy our fresh bakery treats."
        );

        $("#user-name-input").val("");

        toast("Welcome, " + name + "!");
    });


    // ASSIGNMENT 5 - Star rating
    $(".rating-star").on("click", function () {
        const value = Number($(this).data("value"));

        $(".rating-star").each(function () {
            const selected =
                Number($(this).data("value")) <= value;

            $(this).toggleClass("selected", selected);
        });

        $("#rating-value").text(
            "You rated us: " + value + " / 5"
        );
    });


    // ASSIGNMENT 5 - Current date and time
    function updateClock() {
        $("#date-time").text(
            new Date().toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            })
        );
    }

    if ($("#date-time").length) {
        updateClock();
        setInterval(updateClock, 1000);
    }


    // ASSIGNMENT 5 - Background changer
    const backgrounds = [
        "#f8e7d8",
        "#fff0dd",
        "#fce4ec",
        "#e8f5e9",
        "#e3f2fd",
        "#fff3cd"
    ];

    let backgroundIndex = 0;

    $("#color-change-btn").on("click", function () {
        backgroundIndex =
            (backgroundIndex + 1) % backgrounds.length;

        $("#interactive-features").css(
            "background-color",
            backgrounds[backgroundIndex]
        );

        toast("Background color changed!");
    });


    // ASSIGNMENT 5 - Newsletter popup
    function closePopup() {
        $("#contact-popup")
            .removeClass("show")
            .attr("aria-hidden", "true");
    }

    $("#open-popup-btn").on("click", function () {
        $("#contact-popup")
            .addClass("show")
            .attr("aria-hidden", "false");

        $("#popup-email").trigger("focus");
    });

    $("#close-popup-btn").on("click", closePopup);

    $("#contact-popup").on("click", function (event) {
        if (event.target === this) closePopup();
    });

    $(document).on("keydown", function (event) {
        if (event.key === "Escape") closePopup();
    });

    $("#popup-contact-form").on("submit", function (event) {
        event.preventDefault();

        const email = $("#popup-email").val().trim();
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!valid) {
            toast("Enter a valid email.");
            return;
        }

        $("#popup-success").prop("hidden", false);
        this.reset();

        toast("Subscribed successfully! (Demo)");

        setTimeout(function () {
            closePopup();
            $("#popup-success").prop("hidden", true);
        }, 1800);
    });


    // ASSIGNMENT 5 - Read More
    $("#read-more-btn").on("click", function () {
        const $more = $("#extra-content");
        const opening = $more.prop("hidden");

        $more.prop("hidden", !opening);
        $(this).text(opening ? "Read Less" : "Read More");
    });


    // ASSIGNMENT 5 - FAQ accordion (older HTML)
    $(".faq-question").on("click", function () {
        const open =
            $(this).attr("aria-expanded") === "true";

        $(this).attr("aria-expanded", String(!open));

        const answerId = $(this).attr("aria-controls");

        $("#" + answerId).prop("hidden", open);

        $(this).find(".faq-icon").text(open ? "+" : "−");
    });


    // TASK 3 - FAQ search highlighting
    $("#faqSearch").on("input", function () {
        const keyword = $(this).val().trim();
        let count = 0;

        $("#faq .faq-item").each(function () {
            const $item = $(this);
            const $question = $item.find(".faq-label");
            const $answer = $item.find(".faq-answer");

            const question = $question.data("original-text") ??
                $question.text();

            const answer = $answer.data("original-text") ??
                $answer.text();

            const matches = (
                question + " " + answer
            ).toLowerCase().includes(keyword.toLowerCase());

            $item.toggle(matches);

            if (matches) count++;

            highlight($question, keyword);
            highlight($answer, keyword);
        });

        $("#faqSearchCount").text(
            count + " matching questions"
        );
    });


    // TASK 5 - Animated number counter
    let countersStarted = false;

    function animateCounters() {
        const $section = $("#bakery-statistics");

        if (countersStarted || !$section.length) return;

        if (
            $section[0].getBoundingClientRect().top >
            window.innerHeight
        ) return;

        countersStarted = true;

        $(".stat-number").each(function () {
            const $number = $(this);
            const target = Number($number.data("target"));

            $({ value: 0 }).animate(
                { value: target },
                {
                    duration: 1600,
                    step: function (value) {
                        $number.text(Math.floor(value));
                    },
                    complete: function () {
                        $number.text(target);
                    }
                }
            );
        });
    }

    $(window).on("scroll resize", animateCounters);
    animateCounters();


    // ===================================
    // FORM VALIDATION + LOADING SPINNER
    // ===================================

    function showError(inputId, errorId, message) {
        $("#" + inputId).toggleClass(
            "is-invalid",
            Boolean(message)
        );

        $("#" + errorId).text(message);

        return message === "";
    }

    // TASK 6 - Spinner on submit
    // TASK 7 - Toast after submit

    function submitWithSpinner($form, successMessage) {
        const $button = $form.find('button[type="submit"]').first();

        if (!$button.length || $button.prop("disabled")) return;

        const originalText = $button.html();

        $button
            .prop("disabled", true)
            .html(
                '<span class="spinner-border spinner-border-sm me-2" ' +
                'aria-hidden="true"></span>Please wait...'
            );

        setTimeout(function () {
            $button
                .prop("disabled", false)
                .html(originalText);

            const successId = $form.attr("id") === "order-form"
                ? "#order-success"
                : "#contact-success";

            $(successId)
                .text(successMessage)
                .prop("hidden", false);

            toast(successMessage);

            $form[0].reset();
            $form.find(".is-invalid").removeClass("is-invalid");
            $form.find(".validation-message").text("");

        }, 1500);
    }


    // ORDER FORM
    $("#order-form").on("submit", function (event) {
        event.preventDefault();

        const name = $("#order-name").val().trim();
        const email = $("#order-email").val().trim();
        const product = $("#product").val();
        const details = $("#details").val().trim();
        const password = $("#order-password").val();
        const confirm = $("#confirm-password").val();

        const checks = [
            showError(
                "order-name",
                "name-error",
                name.length >= 2 ? "" : "Enter at least 2 characters."
            ),
            showError(
                "order-email",
                "email-error",
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                    ? "" : "Enter a valid email."
            ),
            showError(
                "product",
                "product-error",
                product ? "" : "Select a product."
            ),
            showError(
                "details",
                "details-error",
                details.length >= 5
                    ? "" : "Enter at least 5 characters."
            ),
            showError(
                "order-password",
                "password-error",
                password.length >= 8 && /\d/.test(password)
                    ? "" : "Password needs 8 characters and a number."
            ),
            showError(
                "confirm-password",
                "confirm-password-error",
                confirm && confirm === password
                    ? "" : "Passwords do not match."
            )
        ];

        $("#order-success").prop("hidden", true);

        if (!checks.every(Boolean)) {
            toast("Please correct the highlighted fields.");
            return;
        }

        submitWithSpinner(
            $(this),
            "Order validated successfully! (Demo — not sent)"
        );
    });


    // CONTACT FORM
    $("#contact-form").on("submit", function (event) {
        event.preventDefault();

        const name = $("#name").val().trim();
        const email = $("#email").val().trim();
        const reason = $("#reason").val();
        const message = $("#message").val().trim();

        const checks = [
            showError(
                "name",
                "contact-name-error",
                name.length >= 2 ? "" : "Enter at least 2 characters."
            ),
            showError(
                "email",
                "contact-email-error",
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                    ? "" : "Enter a valid email."
            ),
            showError(
                "reason",
                "contact-reason-error",
                reason ? "" : "Select a contact reason."
            ),
            showError(
                "message",
                "contact-message-error",
                message.length >= 5
                    ? "" : "Enter at least 5 characters."
            )
        ];

        $("#contact-success").prop("hidden", true);

        if (!checks.every(Boolean)) {
            toast("Please complete all required fields.");
            return;
        }

        submitWithSpinner(
            $(this),
            "Message submitted successfully! (Demo — not sent)"
        );
    });


    // Remove validation style while editing
    $("#order-form, #contact-form").on(
        "input change",
        "input, select, textarea",
        function () {
            $(this).removeClass("is-invalid");
        }
    );


    // ===================================
    // TASK 8 - COPY TO CLIPBOARD
    // ===================================

    $("#copyEmailBtn").on("click", async function () {
        const email = $("#bakeryEmail").text().trim();
        const $button = $(this);

        if (!email) {
            toast("Email address not found.");
            return;
        }

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(email);
            } else {
                const $temp = $("<textarea>")
                    .val(email)
                    .css({
                        position: "fixed",
                        top: "0",
                        opacity: "0"
                    })
                    .appendTo("body");

                $temp[0].select();

                const success = document.execCommand("copy");
                $temp.remove();

                if (!success) throw new Error("Copy failed");
            }

            $button
                .text("✓ Copied!")
                .attr("title", "Copied to clipboard!");

            $("#copyEmailTooltip")
                .text("Copied to clipboard!")
                .show();

            toast("Email copied to clipboard!");

            setTimeout(function () {
                $button
                    .text("📋 Copy Email")
                    .attr("title", "Copy email address");

                $("#copyEmailTooltip").text("");
            }, 2500);

        } catch (error) {
            $("#copyEmailTooltip").text("Copy failed.");
            toast("Unable to copy email.");
        }
    });


    // ===================================
    // TASK 9 - IMAGE LAZY LOADING
    // ===================================

    function loadLazyImages() {
        $("img[data-src]").each(function () {
            const position =
                this.getBoundingClientRect().top;

            if (position < window.innerHeight + 220) {
                $(this)
                    .attr("src", $(this).attr("data-src"))
                    .removeAttr("data-src");
            }
        });
    }

    $(window).on("scroll resize load", loadLazyImages);
    loadLazyImages();

});
