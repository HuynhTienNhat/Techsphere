function showForm(formId)
{
    document.querySelectorAll(".form-box").forEach(form => form.classList.remove("active"));
    document.getElementById(formId).classList.add("active");
}

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("action") === "register") {
        showForm("register-form");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Ngăn chặn việc gửi form mặc định

        const formData = new FormData(loginForm);
        const loginData = {
            username: formData.get("username"),
            password: formData.get("password")
        };

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();
            if (result.status === "ok") {
                alert("Đăng nhập thành công!");
                localStorage.setItem("token", result.data.token); // Lưu token nếu cần
                window.location.href = "../html/Home.html"; // Điều hướng sau khi đăng nhập thành công
            } else {
                alert("Đăng nhập thất bại: " + result.message);
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    });

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Ngăn chặn việc gửi form mặc định

        const formData = new FormData(registerForm);
        const registerData = {
            name: formData.get("name"),
            username: formData.get("username"),
            password: formData.get("password"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            address: formData.get("address")
        };

        try {
            const response = await fetch("http://localhost:8080/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(registerData)
            });

            const result = await response.json();
            if (result.status === "ok") {
                alert("Đăng kí thành công!");
                window.location.href = "../html/Home.html"; // Điều hướng sau khi đăng kí thành công
            } else {
                alert("Đăng kí thất bại: " + result.message);
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    });
});



