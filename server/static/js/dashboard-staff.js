const user = JSON.parse(localStorage.getItem('user'))

if (!user) {
  window.location.href = 'login.html'
}

// DOM
const roleText = document.getElementById('roleText')
const roleBadge = document.getElementById('roleBadge')
const profileImage = document.getElementById('profileImage')

// map role
const roleMap = {
  admin: 'ผู้ดูแลระบบ',
  staff: 'พนักงาน'
}

// render
roleText.textContent = `ผู้ใช้ : ${roleMap[user.role]}`
roleBadge.textContent = user.role.toUpperCase()
roleBadge.classList.add(user.role)

profileImage.src = '/user/profile-pic';




// เปิด modal
document.querySelectorAll('.open-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault()

    const targetId = btn.dataset.target
    const modal = document.getElementById(targetId)

    if (!modal) return

    modal.classList.remove('hidden')

    requestAnimationFrame(() => {
      modal.classList.add('show')
    })

    document.body.style.overflow = 'hidden'
  })
})

// ปิด modal
document.querySelectorAll('.close-modal').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.modal')

    modal.classList.remove('show')

    setTimeout(() => {
      modal.classList.add('hidden')
      document.body.style.overflow = ''
    }, 300)
  })
})

// คลิกพื้นหลังเพื่อปิด
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show')

      setTimeout(() => {
        modal.classList.add('hidden')
        document.body.style.overflow = ''
      }, 300)
    }
  })
})

const buttons = document.querySelectorAll('.menu button')
const pages = document.querySelectorAll('.page')

buttons.forEach(btn => {
    btn.addEventListener('click', () => {

        // เปลี่ยนปุ่ม active
        buttons.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')

        // เปลี่ยนหน้า
        pages.forEach(p => p.classList.remove('active'))
        document.getElementById(btn.dataset.page).classList.add('active')
    })
})

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('/user/logout', {
    method: 'GET',
    credentials: 'same-origin'
  });

  // ล้างข้อมูลฝั่ง client
  localStorage.removeItem('user');

  // กลับหน้า login
  window.location.href = '/';
});


