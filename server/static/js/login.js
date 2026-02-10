const form = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = form.username.value.trim();
    const password = form.password.value.trim();

    const res = await fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ username, password })
    });


    const data = await res.json();

    if (!res.ok) {
        errorMsg.style.display = 'block';
        errorMsg.innerText = data.error;
        return;
    }

    // เก็บ user
    localStorage.setItem('user', JSON.stringify(data));

    window.location.href = '/dashboard';
});

form.addEventListener('input', () => {
  errorMsg.style.display = 'none';
});

document.getElementById('forgotForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;

  const data = {
    username: form.username.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    new_password: form.new_password.value
  };

  // loading
  Swal.fire({
    title: 'กำลังตรวจสอบข้อมูล...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    const res = await fetch('/api/user/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // ป้องกันกรณี backend ส่ง HTML กลับมา
    const text = await res.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      throw new Error('เซิร์ฟเวอร์มีปัญหา');
    }

    if (!res.ok) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่สำเร็จ',
        text: result.message || 'ข้อมูลไม่ถูกต้อง'
      });
      return;
    }

    // success
    Swal.fire({
      icon: 'success',
      title: 'สำเร็จ',
      text: result.message || 'เปลี่ยนรหัสผ่านเรียบร้อย'
    });

    document.getElementById('forgetpassModal').classList.add('hidden');
    form.reset();

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: err.message || 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
    });
  }
});


