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

    window.location.href = '/dashboard-staff';
});

form.addEventListener('input', () => {
  errorMsg.style.display = 'none';
});

