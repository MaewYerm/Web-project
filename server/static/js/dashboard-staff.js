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
