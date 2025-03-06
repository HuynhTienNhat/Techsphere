const productBtn = document.querySelector('.productbtn')
const overlay = document.querySelector(".overlay");

// Hiển thị dropdown và overlay
productBtn.addEventListener("click", function(event) {
    overlay.classList.toggle('show')
    event.stopPropagation();
});

document.addEventListener("click", function(event) {
    if (event.target === overlay || (!overlay.contains(event.target) && !productBtn.contains(event.target))) {
        overlay.classList.remove('show');
    }
});


// Hero section

let currentSlide = 0;

function showSlide(index) {
    const slides = document.querySelector('.slides');
    const totalSlides = document.querySelectorAll('.slide').length;

    // Đảm bảo index nằm trong phạm vi hợp lệ
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    // Di chuyển slides
    slides.style.transform = `translateX(${-currentSlide * 100}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Khởi tạo slider
showSlide(currentSlide);