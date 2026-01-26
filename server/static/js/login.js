const form = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // ไม่ให้เปลี่ยนหน้า

    const username = form.username.value.trim();
    const password = form.password.value.trim();


    // เช็คว่าง
    if (!username || !password) {
        errorMsg.style.display = 'block';
        errorMsg.innerText = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
        return;
    }

    const res = await fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
        errorMsg.style.display = 'block';
        errorMsg.innerText = data.error;
        return;
    }

    // login ผ่าน
    window.location.href = '/dashboard-staff';
});

