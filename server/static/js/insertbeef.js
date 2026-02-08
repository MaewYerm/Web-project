document.getElementById('submitBeef').addEventListener('click', async e => {
  e.preventDefault()

  const data = {
    lot_id: lot_id.value.trim(),
    qty: qty.value,
    weight: weight.value,
    receive_date: receive_date.value,
    expired_date: expired_date.value,
    aging: aging.value || null,
    beef_type_id: beef_type_id.value,
    grade_id: grade_id.value,
    storage_id: storage_id.value,

    owner_name: owner_name.value.trim(),
    owner_tel: owner_tel.value,
    owner_email: owner_email.value,
    owner_lineid: owner_lineid.value,
    owner_facebook: owner_facebook.value,
    owner_coop_id: owner_coop_id.value,

    reason: document.getElementById('edit_reason')?.value || null
  }

  if (!data.lot_id || !data.qty || !data.weight || !data.owner_name) {
    return Swal.fire('ข้อมูลไม่ครบ', 'กรุณากรอกข้อมูลที่จำเป็น', 'warning')
  }

  const isUpdate = currentMode === 'update'

  const confirm = await Swal.fire({
    title: isUpdate ? 'ยืนยันการแก้ไข?' : 'ยืนยันการเพิ่มข้อมูล?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: isUpdate ? 'บันทึกการแก้ไข' : 'เพิ่มข้อมูล'
  })

  if (!confirm.isConfirmed) return

  try {
    const res = await fetch(isUpdate ? `/beef/${data.lot_id}` : '/beef', {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!res.ok) throw new Error('บันทึกไม่สำเร็จ')

    await Swal.fire({
      icon: 'success',
      title: isUpdate ? 'แก้ไขสำเร็จ' : 'เพิ่มสำเร็จ',
      timer: 1200,
      showConfirmButton: false
    })

    closeModal(document.getElementById('insertmodal'))
    resetInsertForm()
    location.reload()

  } catch (err) {
    Swal.fire('ผิดพลาด', err.message, 'error')
  }
})


async function loadStorage(selectedId = null) {
  console.log('loadStorage called, selectedId =', selectedId)

  const storageSelect = document.getElementById('storage_id')
  if (!storageSelect) return

  storageSelect.innerHTML = '<option value="">เลือกสถานที่เก็บ</option>'

  try {
    const res = await fetch('/api/storage')
    const data = await res.json()

    data.forEach(item => {
      const option = document.createElement('option')
      option.value = item.storage_id
      option.textContent = item.storage_name

      if (selectedId !== null && String(item.storage_id) === String(selectedId)) {
        option.selected = true
      }

      storageSelect.appendChild(option)
    })
  } catch (err) {
    console.error('โหลดสถานที่เก็บไม่สำเร็จ', err)
  }
}


async function loadBeefTypes(selectedId = null) {
  console.log('loadBeefTypes called, selectedId =', selectedId)

  const select = document.getElementById('beef_type_id')
  if (!select) return

  select.innerHTML = '<option value="">เลือกชนิดเนื้อ</option>'

  try {
    const res = await fetch('/api/beef-type')
    const types = await res.json()

    types.forEach(t => {
      const opt = document.createElement('option')
      opt.value = t.beef_type_id
      opt.textContent = t.type_name

      if (selectedId !== null && String(t.beef_type_id) === String(selectedId)) {
        opt.selected = true
      }

      select.appendChild(opt)
    })
  } catch (err) {
    console.error('โหลดชนิดเนื้อไม่สำเร็จ', err)
  }
}


async function loadgrade(selectedId = null) {
  console.log('loadgrade called, selectedId =', selectedId)

  const select = document.getElementById('grade_id')
  if (!select) return

  select.innerHTML = '<option value="">เลือกเกรดเนื้อ</option>'

  try {
    const res = await fetch('/api/grade')
    const types = await res.json()

    types.forEach(t => {
      const opt = document.createElement('option')
      opt.value = t.grade_id
      opt.textContent = t.grade_name

      if (selectedId !== null && String(t.grade_id) === String(selectedId)) {
        opt.selected = true
      }

      select.appendChild(opt)
    })
  } catch (err) {
    console.error('โหลดเกรดเนื้อไม่สำเร็จ', err)
  }
}
