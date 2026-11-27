// Campus Book Exchange
// JavaScript functionality for the project


// --------------------------------------------------
// BOOK DATA
// --------------------------------------------------

const defaultBooks = [
    {
        id: "hci",
        title: "Human-Computer Interaction",
        course: "CSCI 3703",
        price: 30,
        condition: "Like New",
        edition: "Current Edition",
        seller: "Student Seller",
        description: "This textbook is in good condition and is available for another student in the course."
    },

    {
        id: "biology",
        title: "Biology Textbook",
        course: "BIOL 101",
        price: 25,
        condition: "Good",
        edition: "Current Edition",
        seller: "Student Seller",
        description: "This biology textbook is in good condition and is available for another student."
    },

    {
        id: "psychology",
        title: "Psychology Textbook",
        course: "PSYC 101",
        price: 20,
        condition: "Used - Good",
        edition: "Current Edition",
        seller: "Student Seller",
        description: "This psychology textbook is used but still in good condition."
    }
];


// Get books that users have posted
function getPostedBooks() {
    const savedBooks = localStorage.getItem("postedBooks");

    if (savedBooks) {
        return JSON.parse(savedBooks);
    }

    return [];
}


// Get all books
function getAllBooks() {
    return defaultBooks.concat(getPostedBooks());
}


// Find one book using its ID
function findBook(bookId) {
    const books = getAllBooks();

    return books.find(function (book) {
        return book.id === bookId;
    });
}


// Make condition names easier to read
function formatCondition(condition) {
    if (condition === "new") {
        return "New";
    }

    if (condition === "like-new") {
        return "Like New";
    }

    if (condition === "good") {
        return "Good";
    }

    if (condition === "fair") {
        return "Fair";
    }

    if (condition === "used") {
        return "Used";
    }

    return condition;
}


// --------------------------------------------------
// HOME PAGE - SEARCH
// --------------------------------------------------

const searchButton = document.getElementById("search-button");

if (searchButton) {

    const searchInput = document.getElementById("search");


    // Add books posted by users to the homepage
    const postedBooks = getPostedBooks();

    const firstBookCard = document.querySelector(".book-card");

    if (firstBookCard) {

        const bookSection = firstBookCard.parentElement;

        postedBooks.forEach(function (book) {

            const article = document.createElement("article");
            article.className = "book-card";

            const title = document.createElement("h3");
            title.textContent = book.title;

            const course = document.createElement("p");
            course.textContent = "Course: " + book.course;

            const price = document.createElement("p");
            price.textContent = "Price: $" + book.price;

            const condition = document.createElement("p");
            condition.textContent =
                "Condition: " + book.condition;

            const detailsLink = document.createElement("a");

            detailsLink.href =
                "book-details.html?id=" + book.id;

            detailsLink.textContent = "View Details";


            article.appendChild(title);
            article.appendChild(course);
            article.appendChild(price);
            article.appendChild(condition);
            article.appendChild(detailsLink);

            bookSection.appendChild(article);
        });
    }


    // Search books
    function searchBooks() {

        const searchText =
            searchInput.value.toLowerCase().trim();

        const bookCards =
            document.querySelectorAll(".book-card");

        let bookFound = false;


        bookCards.forEach(function (book) {

            const bookText =
                book.textContent.toLowerCase();

            if (bookText.includes(searchText)) {

                book.style.display = "block";
                bookFound = true;

            } else {

                book.style.display = "none";
            }
        });


        if (!bookFound && searchText !== "") {
            alert("No matching books found.");
        }
    }


    // Search button
    searchButton.addEventListener("click", searchBooks);


    // Press Enter to search
    searchInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            searchBooks();
        }
    });
}


// --------------------------------------------------
// BOOK DETAILS PAGE
// --------------------------------------------------

const bookTitle = document.getElementById("book-course");

if (bookTitle) {

    const parameters =
        new URLSearchParams(window.location.search);

    const bookId =
        parameters.get("id") || "hci";

    const book =
        findBook(bookId);


    if (book) {

        document.getElementById("book-title").textContent =
            book.title;

        document.getElementById("book-course").textContent =
            book.course;

        document.getElementById("book-price").textContent =
            book.price;

        document.getElementById("book-condition").textContent =
            book.condition;

        document.getElementById("book-edition").textContent =
            book.edition;

        document.getElementById("book-seller").textContent =
            book.seller;

        document.getElementById("book-description").textContent =
            book.description;


        // Send the correct book to the Contact page
        document.getElementById("contact-owner").href =
            "contact.html?id=" +
            book.id +
            "&action=contact";


        // Send the correct book to the Exchange page
        document.getElementById("request-exchange").href =
            "contact.html?id=" +
            book.id +
            "&action=exchange";
    }
}


// --------------------------------------------------
// CONTACT OWNER / REQUEST EXCHANGE
// --------------------------------------------------

const contactForm =
    document.getElementById("contact-form");

if (contactForm) {

    const parameters =
        new URLSearchParams(window.location.search);

    const bookId =
        parameters.get("id") || "hci";

    const action =
        parameters.get("action") || "contact";

    const book =
        findBook(bookId);


    if (book) {

        document.getElementById("contact-book-title").textContent =
            book.title;

        document.getElementById("contact-seller").textContent =
            book.seller;

        document.getElementById("contact-price").textContent =
            book.price;

        document.getElementById("contact-condition").textContent =
            book.condition;


        document.getElementById("back-details-link").href =
            "book-details.html?id=" + book.id;


        // Change wording when requesting an exchange
        if (action === "exchange") {

            document.getElementById("contact-heading").textContent =
                "Request Exchange";

            document.getElementById("contact-submit").textContent =
                "Send Exchange Request";

            document.getElementById("message").placeholder =
                "Type your exchange request";
        }
    }


    // Send message
    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const message =
            document.getElementById("message").value.trim();

        const status =
            document.getElementById("contact-status");

        status.setAttribute("aria-live", "polite");


        if (message === "") {

            status.textContent =
                "Please enter a message.";

            return;
        }


        if (action === "exchange") {

            status.textContent =
                "Your exchange request has been sent.";

        } else {

            status.textContent =
                "Your message has been sent to the seller.";
        }


        contactForm.reset();
    });
}


// --------------------------------------------------
// POST A BOOK PAGE
// --------------------------------------------------

const postBookForm =
    document.getElementById("post-book-form");

if (postBookForm) {

    postBookForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const title =
            document.getElementById("book-title").value.trim();

        const course =
            document.getElementById("course").value.trim();

        const price =
            document.getElementById("price").value;

        const condition =
            document.getElementById("condition").value;

        const status =
            document.getElementById("post-status");


        // Make sure required information is entered
        if (
            title === "" ||
            course === "" ||
            price === "" ||
            condition === ""
        ) {

            status.textContent =
                "Please complete all required book information.";

            return;
        }


        if (Number(price) < 0) {

            status.textContent =
                "Please enter a valid price.";

            return;
        }


        const newBook = {

            id: "book-" + Date.now(),

            title: title,

            course: course,

            price: price,

            condition: formatCondition(condition),

            edition: "Not specified",

            seller: "Student Seller",

            description:
                "This textbook was posted by a student on Campus Book Exchange."
        };


        const postedBooks =
            getPostedBooks();

        postedBooks.push(newBook);


        // Save the book in the browser
        localStorage.setItem(
            "postedBooks",
            JSON.stringify(postedBooks)
        );


        status.textContent =
            "Book posted successfully!";


        postBookForm.reset();


        // Open the new book after posting
        setTimeout(function () {

            window.location.href =
                "book-details.html?id=" + newBook.id;

        }, 700);
    });
}