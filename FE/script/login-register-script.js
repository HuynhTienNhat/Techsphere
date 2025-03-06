function showForm(formId)
{
    document.querySelectorAll(".form-box").forEach(form => form.classList.remove("active"));
    document.getElementById(formId).classList.add("active");
}

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

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
});



