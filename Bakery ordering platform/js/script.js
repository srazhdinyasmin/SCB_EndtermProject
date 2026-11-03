
/*
 SWEET CRUMB BAKERY
 Assignment 5 + Assignment 6
 Team: Nurlankyzy Zhanshuak,
 Srazhdin Yasmin, Urinbay Nurgul
*/

$(document).ready(function () {

  // TASK 0 — jQuery Setup
  console.log("jQuery is ready!");


  // TASK 7 — Toast Notifications
  $("body").append(
    '<div id="bakeryToast" role="status" aria-live="polite"></div>'
  );

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


  // TASK 4 — Scroll Progress Bar
  $("body").prepend(
    '<div id="scrollProgress" aria-hidden="true"></div>'
  );

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


  // ASSIGNMENT 5 — DAY / NIGHT THEME
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


  // TASK 3 — REUSABLE SEARCH HIGHLIGHTING
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


  // ASSIGNMENT 5 — ORIGINAL PRODUCT DATA
  const products = [
    {
      name: "Butter Croissant",
      category: "pastry",
      price: 1200,
      description:
        "Light and flaky croissant made with real butter.",
      available: true
    },
    {
      name: "Cinnamon Roll",
      category: "pastry",
      price: 1500,
      description:
        "Soft dough filled with cinnamon and sugar.",
      available: true
    },
    {
      name: "Sourdough Bread",
      category: "bread",
      price: 1800,
      description:
        "Traditional sourdough bread baked fresh daily.",
      available: true
    },
    {
      name: "Chocolate Cake",
      category: "cake",
      price: 9500,
      description:
        "Rich chocolate sponge with smooth cream.",
      available: true
    },
    {
      name: "Blueberry Muffin",
      category: "pastry",
      price: 900,
      description:
        "Soft muffin packed with fresh blueberries.",
      available: true
    },
    {
      name: "Whole Wheat Loaf",
      category: "bread",
      price: 1600,
      description:
        "Healthy whole wheat bread.",
      available: false
    }
  ];


  // TASK 1 — REAL-TIME SEARCH AND LIVE FILTER
  let selectedCategory = "all";

  function renderProducts() {
    if (!$("#product-list").length) return;

    const keyword =
      ($("#searchInput").val() || "").trim();

    const matches = products.filter(function (product) {
      const categoryMatch =
        selectedCategory === "all" ||
        product.category === selectedCategory;

      const text = (
        product.name + " " + product.description
      ).toLowerCase();

      return categoryMatch &&
        text.includes(keyword.toLowerCase());
    });

    const $list = $("#product-list").empty();

    matches.forEach(function (product) {

      const $item = $("<div>")
        .addClass(
          "col-12 col-md-6 col-lg-4 product-card-item"
        )
        .attr("data-category", product.category);

      const $card = $("<article>")
        .addClass("card h-100 bakery-card");

      const $body = $("<div>")
        .addClass("card-body d-flex flex-column");

      const $name = $("<h3>")
        .addClass("card-title")
        .text(product.name);

      const $description = $("<p>")
        .addClass("card-text")
        .text(product.description);

      // TASK 3 — Highlight matching words
      highlight($name, keyword);
      highlight($description, keyword);

      const $price = $("<p>")
        .addClass("fw-bold text-accent")
        .text(
          product.price.toLocaleString("en-US") +
          " KZT"
        );

      const $badge = $("<span>")
        .addClass(
          "badge mb-3 " +
          (product.available
            ? "available"
            : "unavailable")
        )
        .text(
          product.available
            ? "Available"
            : "Sold Out"
        );

      const $order = $("<a>")
        .addClass("btn btn-primary mt-auto")
        .attr("href", "order.html")
        .text("Order");

      $body.append(
        $name,
        $description,
        $price,
        $badge,
        $order
      );

      $card.append($body);
      $item.append($card);
      $list.append($item);
    });

    if (!matches.length) {
      $list.append(
        '<p class="text-center">No matching products found.</p>'
      );
    }

    $("#searchCount").text(
      matches.length + " matching products"
    );
  }


  // ASSIGNMENT 5 — CATEGORY FILTER BUTTONS
  $(".filter-buttons").on(
    "click",
    "[data-filter]",
    function () {

      selectedCategory = $(this).data("filter");

      $(".filter-buttons [data-filter]")
        .removeClass("active btn-primary")
        .addClass("btn-outline-secondary");

      $(this)
        .addClass("active btn-primary")
        .removeClass("btn-outline-secondary");

      renderProducts();
    }
  );


  // TASK 2 — AUTOCOMPLETE SUGGESTIONS
  $("#searchInput").on("input", function () {

    renderProducts();

    const value = $(this)
      .val()
      .trim()
      .toLowerCase();

    const $suggestions =
      $("#suggestions").empty();

    if (!value) return;

    products
      .filter(function (product) {
        return product.name
          .toLowerCase()
          .includes(value);
      })
      .slice(0, 6)
      .forEach(function (product) {

        $("<button>")
          .attr("type", "button")
          .attr("role", "option")
          .addClass("bakery-suggestion")
          .text(product.name)
          .appendTo($suggestions);
      });
  });

  $("#suggestions").on(
    "click",
    ".bakery-suggestion",
    function () {

      const selected = $(this).text();

      selectedCategory = "all";

      $('.filter-buttons [data-filter="all"]')
        .trigger("click");

      $("#searchInput").val(selected);
      $("#suggestions").empty();

      renderProducts();

      toast("Selected: " + selected);
    }
  );

  $("#searchInput").on("keydown", function (event) {
    if (event.key === "Escape") {
      $("#suggestions").empty();
    }
  });

  $(document).on("click", function (event) {
    if (
      !$(event.target)
        .closest(".bakery-search-area").length
    ) {
      $("#suggestions").empty();
    }
  });

  renderProducts();


  // ASSIGNMENT 5 — TIME-BASED GREETING
  function timeGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Good morning";
    }

    if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    }

    if (hour >= 17 && hour < 22) {
      return "Good evening";
    }

    return "Hello night owl";
  }

  $("#time-greeting").text(
    timeGreeting() +
    "! Welcome to Sweet Crumb Bakery."
  );


  // ASSIGNMENT 5 — PERSONAL GREETING
  $("#name-greeting-form").on(
    "submit",
    function (event) {

      event.preventDefault();

      const name = $("#user-name-input")
        .val()
        .trim();

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
    }
  );


  // ASSIGNMENT 5 — STAR RATING
  $(".rating-star").on("click", function () {

    const value = Number(
      $(this).data("value")
    );

    $(".rating-star").each(function () {

      const selected =
        Number($(this).data("value")) <= value;

      $(this).toggleClass(
        "selected",
        selected
      );
    });

    $("#rating-value").text(
      "You rated us: " + value + " / 5"
    );
  });


  // ASSIGNMENT 5 — CURRENT DATE AND TIME
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


  // ASSIGNMENT 5 — BACKGROUND COLOR CHANGER
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


  // ASSIGNMENT 5 — NEWSLETTER POPUP
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
    if (event.target === this) {
      closePopup();
    }
  });

  $(document).on("keydown", function (event) {
    if (event.key === "Escape") {
      closePopup();
    }
  });

  $("#popup-contact-form").on(
    "submit",
    function (event) {

      event.preventDefault();

      const email = $("#popup-email")
        .val()
        .trim();

      const valid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
    }
  );


  // ASSIGNMENT 5 — READ MORE BUTTON
  $("#read-more-btn").on("click", function () {

    const $more = $("#extra-content");
    const opening = $more.prop("hidden");

    $more.prop("hidden", !opening);

    $(this).text(
      opening ? "Read Less" : "Read More"
    );
  });


  // ASSIGNMENT 5 — FAQ ACCORDION
  $(".faq-question").on("click", function () {

    const open =
      $(this).attr("aria-expanded") === "true";

    $(this).attr(
      "aria-expanded",
      String(!open)
    );

    const answerId = $(this)
      .attr("aria-controls");

    $("#" + answerId).prop("hidden", open);

    $(this).find(".faq-icon").text(
      open ? "+" : "−"
    );
  });


  // TASK 3 — SEARCH HIGHLIGHTING IN FAQ
  $("#faqSearch").on("input", function () {

    const keyword = $(this).val().trim();
    let count = 0;

    $("#faq .faq-item").each(function () {

      const $item = $(this);
      const $question =
        $item.find(".faq-label");

      const $answer =
        $item.find(".faq-answer");

      const question =
        $question.data("original-text") ??
        $question.text();

      const answer =
        $answer.data("original-text") ??
        $answer.text();

      const matches = (
        question + " " + answer
      ).toLowerCase().includes(
        keyword.toLowerCase()
      );

      $item.toggle(matches);

      if (matches) count++;

      highlight($question, keyword);
      highlight($answer, keyword);
    });

    $("#faqSearchCount").text(
      count + " matching questions"
    );
  });


  // TASK 5 — ANIMATED NUMBER COUNTER
  let countersStarted = false;

  function animateCounters() {

    const $section =
      $("#bakery-statistics");

    if (
      countersStarted ||
      !$section.length
    ) {
      return;
    }

    if (
      $section[0]
        .getBoundingClientRect()
        .top > window.innerHeight
    ) {
      return;
    }

    countersStarted = true;

    $(".stat-number").each(function () {

      const $number = $(this);

      const target = Number(
        $number.data("target")
      );

      $({ value: 0 }).animate(
        { value: target },
        {
          duration: 1600,

          step: function (value) {
            $number.text(
              Math.floor(value)
            );
          },

          complete: function () {
            $number.text(target);
          }
        }
      );
    });
  }

  $(window).on(
    "scroll resize",
    animateCounters
  );

  animateCounters();


  // ASSIGNMENT 5 — FORM VALIDATION
  // TASK 6 — SPINNER ON SUBMIT
  // TASK 7 — SUCCESS TOAST

  function errorFor(id, message) {

    const inputSelectors = {
      "name": "#order-name",
      "email": "#order-email",
      "product": "#product",
      "details": "#details",
      "password": "#order-password",
      "confirm-password": "#confirm-password",
      "contact-name": "#name",
      "contact-email": "#email",
      "contact-message": "#message"
    };

    $("#" + id + "-error").text(message);

    const selector =
      inputSelectors[id] || "#" + id;

    $(selector).toggleClass(
      "is-invalid",
      Boolean(message)
    );

    return !message;
  }


  function startSubmitting(
    $form,
    message,
    buttonText
  ) {

    const $button =
      $form.find('[type="submit"]');

    if ($button.prop("disabled")) return;

    $button
      .prop("disabled", true)
      .html(
        '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Please wait...'
      );

    // Simulated server request
    setTimeout(function () {

      $button
        .prop("disabled", false)
        .text(buttonText);

      $form.find(".is-invalid")
        .removeClass("is-invalid");

      $form.find(".validation-message")
        .text("");

      $form[0].reset();

      const boxId =
        $form.attr("id") === "order-form"
          ? "#order-success"
          : "#contact-success";

      $(boxId)
        .text(message)
        .prop("hidden", false);

      toast(message);

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

    const validations = [

      errorFor(
        "name",
        name.length >= 2
          ? ""
          : "Enter at least 2 characters."
      ),

      errorFor(
        "email",
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? ""
          : "Enter a valid email."
      ),

      errorFor(
        "product",
        product
          ? ""
          : "Select a product."
      ),

      errorFor(
        "details",
        details.length >= 5
          ? ""
          : "Enter at least 5 characters."
      ),

      errorFor(
        "password",
        password.length >= 8 &&
        /\d/.test(password)
          ? ""
          : "Password needs 8 characters and a number."
      ),

      errorFor(
        "confirm-password",
        confirm && confirm === password
          ? ""
          : "Passwords do not match."
      )
    ];

    const valid =
      validations.every(Boolean);

    $("#order-success")
      .prop("hidden", true);

    if (!valid) {
      toast(
        "Please correct the highlighted fields."
      );

      $("#order-form .is-invalid")
        .first()
        .trigger("focus");

      return;
    }

    startSubmitting(
      $(this),
      "Order validated successfully! (Demo — not sent to a server)",
      "Place Order"
    );
  });

  $("#order-form input, #order-form select, #order-form textarea")
    .on("input change", function () {
      $(this).removeClass("is-invalid");
    });


  // CONTACT FORM
  $("#contact-form").on("submit", function (event) {

    event.preventDefault();

    const name =
      $("#name").val().trim();

    const email =
      $("#email").val().trim();

    const message =
      $("#message").val().trim();

    const validations = [

      errorFor(
        "contact-name",
        name.length >= 2
          ? ""
          : "Enter at least 2 characters."
      ),

      errorFor(
        "contact-email",
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? ""
          : "Enter a valid email."
      ),

      errorFor(
        "contact-message",
        message.length >= 5
          ? ""
          : "Enter at least 5 characters."
      )
    ];

    $("#contact-success")
      .prop("hidden", true);

    if (!validations.every(Boolean)) {

      toast(
        "Please correct the highlighted fields."
      );

      $("#contact-form .is-invalid")
        .first()
        .trigger("focus");

      return;
    }

    startSubmitting(
      $(this),
      "Message validated successfully! (Demo — not sent to a server)",
      "Send Message"
    );
  });

  $("#contact-form input, #contact-form textarea")
    .on("input", function () {
      $(this).removeClass("is-invalid");
    });


  // TASK 8 — COPY TO CLIPBOARD
  $("#copyEmailBtn").on(
    "click",
    async function () {

      const email =
        $("#bakeryEmail").text().trim();

      try {

        if (
          navigator.clipboard &&
          window.isSecureContext
        ) {

          await navigator.clipboard.writeText(
            email
          );

        } else {

          const $area = $("<textarea>")
            .val(email)
            .appendTo("body");

          $area[0].select();

          const copied =
            document.execCommand("copy");

          $area.remove();

          if (!copied) {
            throw new Error("Copy failed");
          }
        }

        $(this)
          .text("✓ Copied!")
          .attr(
            "title",
            "Copied to clipboard!"
          );

        $("#copyEmailTooltip").text(
          "Copied to clipboard!"
        );

        toast("Email copied to clipboard!");

        setTimeout(function () {

          $("#copyEmailBtn")
            .text("📋 Copy Email")
            .attr(
              "title",
              "Copy email address"
            );

          $("#copyEmailTooltip").text("");

        }, 2000);

      } catch (error) {

        toast(
          "Could not copy email."
        );
      }
    }
  );


  // TASK 9 — JQUERY IMAGE LAZY LOADING
  function loadLazyImages() {

    $("img[data-src]").each(function () {

      const position =
        this.getBoundingClientRect().top;

      if (
        position <
        window.innerHeight + 220
      ) {

        $(this)
          .attr(
            "src",
            $(this).attr("data-src")
          )
          .removeAttr("data-src");
      }
    });
  }

  $(window).on(
    "scroll resize load",
    loadLazyImages
  );

  loadLazyImages();

});
