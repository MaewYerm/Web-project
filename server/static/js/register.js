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
