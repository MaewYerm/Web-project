console.log('modal system loaded')

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

const params = new URLSearchParams(window.location.search);

if (params.get('register') === 'success') {
  Swal.fire({
    icon: 'success',
    title: 'สมัครสมาชิกสำเร็จ',
    text: 'สามารถเข้าสู่ระบบได้ทันที',
    confirmButtonText: 'ตกลง'
  }).then(() => {
    // ล้าง query ออกจาก URL
    window.history.replaceState({}, document.title, '/');
  });
}

if (params.get('register') === 'fail') {
  Swal.fire({
    icon: 'error',
    title: 'สมัครไม่สำเร็จ',
    text: 'กรุณาตรวจสอบข้อมูลอีกครั้ง',
    confirmButtonText: 'ตกลง'
  }).then(() => {
    window.history.replaceState({}, document.title, '/');
  });
}