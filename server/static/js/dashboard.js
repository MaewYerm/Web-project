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


let currentMode = 'insert'   // insert | update
let editingItem = null      // item ที่กำลังแก้ไข

function setModalTitle(titleText) {
  const title = document.querySelector('#insertmodal .modal-title')
  const subtitle = document.querySelector('#insertmodal .modal-subtitle')
  const submitBtn = document.getElementById('submitBeef')
  const reasonBox = document.getElementById('edit-reason-box')

  title.textContent = titleText

  if (currentMode === 'update') {
    subtitle.textContent = 'กรอกรายละเอียดของเนื้อวัวที่ต้องการแก้ไข'
    submitBtn.textContent = 'บันทึกการแก้ไข'
    reasonBox.style.display = 'block'
  } else {
    subtitle.textContent = 'กรอกรายละเอียดของเนื้อวัวที่ต้องการเพิ่ม'
    submitBtn.textContent = 'เพิ่มรายการ'
    reasonBox.style.display = 'none'
  }
}

// ===== เปิด modal เพิ่ม =====
document.querySelectorAll('.open-modal').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault()

    const modal = document.getElementById(btn.dataset.target)
    if (!modal) return

    currentMode = 'insert'
    editingItem = null

    resetInsertForm()
    setModalTitle('เพิ่มรายการเนื้อ')

    openModal(modal)

    loadStorage()
    loadBeefTypes()
    loadgrade()
  })
})

// ===== เปิด modal แก้ไข =====
document.addEventListener('click', async e => {
  const editBtn = e.target.closest('.btn-edit')
  if (!editBtn) return

  console.log('EDIT CLICKED ✅')

  const item = JSON.parse(editBtn.dataset.item)
  console.log('edit item =', item)

  currentMode = 'update'
  editingItem = item

  fillFormForUpdate(item)
  setModalTitle('แก้ไขข้อมูลชิ้นเนื้อ')

  openModal(document.getElementById('insertmodal'))

  loadStorage(item.storage_id)
  loadBeefTypes(item.beef_type_id)
  loadgrade(item.grade_id)

})



// ===== modal control =====
function openModal(modal) {
  modal.classList.remove('hidden')
  requestAnimationFrame(() => modal.classList.add('show'))
  document.body.style.overflow = 'hidden'
}

function closeModal(modal) {
  modal.classList.remove('show')
  setTimeout(() => {
    modal.classList.add('hidden')
    document.body.style.overflow = ''
  }, 300)
}

// ===== ปิด modal =====
document.querySelectorAll('.close-modal').forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal(btn.closest('.modal'))
  })
})

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal(modal)
  })
})

function formatDateForInput(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().split('T')[0]
}


// ===== form helper =====
function fillFormForUpdate(item) {
  document.getElementById('lot_id').value = item.lot_id
  document.getElementById('lot_id').disabled = true

  document.getElementById('qty').value = item.qty
  document.getElementById('weight').value = item.weight
  document.getElementById('receive_date').value =
    formatDateForInput(item.receive_date)
  document.getElementById('expired_date').value =
    formatDateForInput(item.expired_date)
  document.getElementById('aging').value = item.aging || ''

  document.getElementById('owner_name').value = item.owner
  document.getElementById('owner_tel').value = item.owner_tel || ''
  document.getElementById('owner_email').value = item.owner_email || ''
  document.getElementById('owner_lineid').value = item.owner_lineid || ''
  document.getElementById('owner_facebook').value = item.owner_facebook || ''
  document.getElementById('owner_coop_id').value = item.owner_coop_id || ''
}

function resetInsertForm() {
  const form = document.getElementById('insertBeefForm')
  form.reset()
  document.getElementById('lot_id').disabled = false
}

// ปุ่มลบ
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.btn-delete')
  if (!btn) return

  const lotId = btn.dataset.lot
  console.log('DELETE CLICKED:', lotId)

  Swal.fire({
    title: 'ยืนยันการลบ?',
    text: `ต้องการลบ Lot ${lotId} ใช่หรือไม่`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteBeef(lotId)
    }
  })
})

// ปุ่มเบิก
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.btn-withdraw')
  if (!btn) return

  const item = JSON.parse(btn.dataset.item)

  const { value: withdrawQty } = await Swal.fire({
    title: 'เบิกชิ้นเนื้อ',
    html: `
      <p>หมายเลขรายการ: <b>${item.lot_id}</b></p>
      <p>ชิ้นเนื้อคงเหลือ: <b>${item.qty}</b></p>
    `,
    input: 'number',
    inputLabel: 'จำนวนที่ต้องการเบิก',
    inputAttributes: {
      min: 1,
      max: item.qty
    },
    showCancelButton: true,
    confirmButtonText: 'เบิก',
    cancelButtonText: 'ยกเลิก',
    inputValidator: (value) => {
      if (!value) return 'กรุณาใส่จำนวน'
      if (value <= 0) return 'จำนวนต้องมากกว่า 0'
      if (value > item.qty) return 'เบิกเกินจำนวนคงเหลือ'
    }
  })

  if (!withdrawQty) return

  await fetch('/api/beef/withdraw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lot_id: item.lot_id,
      qty: Number(withdrawQty)
    })
  })


  Swal.fire({
    icon: 'success',
    title: 'เบิกสำเร็จ',
    timer: 1200,
    showConfirmButton: false
  })

  setTimeout(() => location.reload(), 1200)
})


async function deleteBeef(lotId) {
  try {
    const res = await fetch('/api/beef/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lot_id: lotId,
        reason: 'ลบจากหน้า dashboard'
      })
    })

    const data = await res.json()

    if (!res.ok) {
      Swal.fire({
        icon: 'error',
        title: 'ลบไม่สำเร็จ',
        text: data.message || 'เกิดข้อผิดพลาด'
      })
      return
    }

    Swal.fire({
      icon: 'success',
      title: 'ลบเรียบร้อย',
      text: `Lot ${lotId} ถูกลบแล้ว`,
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      location.reload()
    })

  } catch (err) {
    console.error(err)
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
    })
  }
}


const buttons = document.querySelectorAll('.top-nav button')
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

const subNavButtons = document.querySelectorAll('#setting .sub-menu button');
const subPages = document.querySelectorAll('#setting .sub-page');

subNavButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.page;

    // active ปุ่ม
    subNavButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // ซ่อน page ย่อยทั้งหมด
    subPages.forEach(p => p.classList.remove('active'));

    // แสดง page ที่เลือก
    const targetPage = document.getElementById(targetId);
    if (targetPage) {
      targetPage.classList.add('active');
    }
  });
});



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


