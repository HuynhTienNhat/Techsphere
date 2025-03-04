const dropdownBtn = document.querySelector(".dropbtn");
const dropdownContent = document.querySelector(".dropdown-content");
const overlay = document.querySelector(".overlay");

// Hiển thị dropdown và overlay
dropdownBtn.addEventListener("click", function(event) {
    event.preventDefault();
    dropdownContent.classList.toggle("show");
    overlay.style.display = dropdownContent.classList.contains("show") ? "block" : "none";
});

// Đóng dropdown khi click ra ngoài
window.addEventListener("click", function(event) {
    if (!event.target.closest(".dropdown")) {
        dropdownContent.classList.remove("show");
        overlay.style.display = "none";
    }
});
