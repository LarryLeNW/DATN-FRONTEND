// Hàm gửi email qua API
function sendEmail(recipient, subject, body) {
    fetch("http://localhost:8080/api/mail/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            recipient: recipient,
            subject: subject,
            body: body
        })
    })
    .then(response => response.text())
    .then(data => {
        console.log("Response:", data); // Xử lý phản hồi từ server
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

// Gọi hàm sendEmail với các tham số cụ thể
sendEmail("FASHION@VIETNAM.COM", "#", "#");
