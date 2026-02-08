
document.querySelectorAll('.btn-user-delete').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();

    const userId = this.dataset.id;

    Swal.fire({
      title: 'ยืนยันการลบ?',
      text: 'การลบผู้ใช้ไม่สามารถกู้คืนได้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `/setting/user/delete/${userId}`;
      }
    });
  });
});

// เปิด modal

document.querySelectorAll('.open-modal').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault()

    const modal = document.getElementById(btn.dataset.target)
    if (!modal) return

    const userId = btn.dataset.userId

    document.getElementById('m-username').innerText = btn.dataset.username
    document.getElementById('m-name').innerText =
      btn.dataset.firstname + ' ' + btn.dataset.lastname
    document.getElementById('m-birthday').innerText = btn.dataset.birthday || '-'
    document.getElementById('m-citizen').innerText = btn.dataset.citizen || '-'
    document.getElementById('m-address').innerText = btn.dataset.address || '-'
    document.getElementById('m-nation').innerText = btn.dataset.nation || '-'
    document.getElementById('m-tel-main').innerText = btn.dataset.telMain || '-'
    document.getElementById('m-tel-sub').innerText = btn.dataset.telSub || '-'
    document.getElementById('m-email').innerText = btn.dataset.email || '-'
    document.getElementById('m-gender').innerText = btn.dataset.gender
    document.getElementById('m-role').innerText = btn.dataset.role
    const roleSelect = document.getElementById('m-role-select')
    roleSelect.value = btn.dataset.roleId

    const isSelf = btn.dataset.self === 'true'
    const saveBtn = document.getElementById('save-role')

    if (isSelf) {
      roleSelect.disabled = true
      saveBtn.disabled = true
    } else {
      roleSelect.disabled = false
      saveBtn.disabled = false
    }



    // ===== รูป (สำคัญมาก) =====
    const img = document.getElementById('modal-photo')
    img.src = `/setting/profile-pic/${userId}?t=${Date.now()}`

    // ===== show modal =====
    modal.classList.remove('hidden')
    requestAnimationFrame(() => modal.classList.add('show'))
    document.body.style.overflow = 'hidden'

    document.getElementById('save-role').onclick = () => updateRole(userId)
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

function updateRole(userId) {
  const roleId = document.getElementById('m-role-select').value
  const modal = document.querySelector('.modal.show')

  fetch('/setting/user/role', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, role_id: roleId })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {

        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: 'อัปเดตสิทธิ์เรียบร้อย',
          confirmButtonText: 'ตกลง'
        }).then(() => {
          modal.classList.remove('show')
          modal.classList.add('hidden')
          document.body.style.overflow = ''

          location.reload()
        })

      } else {
        Swal.fire('ผิดพลาด', data.message, 'error')
      }
    })
}


/*********************************
 * PAGE SWITCH
 *********************************/
function openPage(pageId) {
  // ซ่อนทุก sub-page
  document.querySelectorAll('.sub-page').forEach(p => {
    p.style.display = 'none';
  });

  const page = document.getElementById(pageId);
  if (!page) {
    console.error('ไม่พบ page:', pageId);
    return;
  }

  // แสดง page ที่เลือก
  page.style.display = 'block';

  // init เฉพาะหน้า storage
  if (pageId === 'storage-setting') {
    initStoragePage();
  }
}

/*********************************
 * STORAGE PAGE LOGIC
 *********************************/
let storagePageInitialized = false;

async function loadStorages() {
  const storageListEl = document.getElementById('storageList-setting');
  if (!storageListEl) return;

  try {
    const res = await fetch('/api/setting/storage');
    const storages = await res.json();

    storageListEl.innerHTML = '';

    if (!Array.isArray(storages) || storages.length === 0) {
      storageListEl.innerHTML =
        `<div class="st-empty">ยังไม่มีสถานที่จัดเก็บ</div>`;
      return;
    }

    storages.forEach(s => {
      const item = document.createElement('div');
      item.className = 'st-storage-item';

      item.innerHTML = `
        <div class="st-storage-info">
          <div class="st-storage-name">${s.storage_name}</div>
          <div class="st-storage-meta">
            ประเภท: ${s.storage_type} |
            ความจุ: ${s.capacity} |
            ${s.temperature} °C
          </div>
        </div>
        <div class="st-storage-actions">
          <button class="st-action-btn delete"
            onclick="deleteStorage(${s.storage_id})"><img src="/image/bin.png"></button>
        </div>
      `;

      storageListEl.appendChild(item);
    });
  } catch (err) {
    console.error(err);
    storageListEl.innerHTML =
      `<div class="st-error">โหลดข้อมูลไม่สำเร็จ</div>`;
  }
}

function initStoragePage() {
  const storageForm = document.getElementById('storageForm');
  const storageListEl = document.getElementById('storageList-setting');

  if (!storageForm || !storageListEl) {
    console.error('storageForm หรือ storageList ไม่พบ');
    return;
  }

  // bind event แค่ครั้งเดียว
  if (!storagePageInitialized) {
    storagePageInitialized = true;

    storageForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(storageForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch('/api/setting/storage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message);

        Swal.fire({
          icon: 'success',
          title: 'เพิ่มสถานที่เก็บสำเร็จ',
          timer: 1200,
          showConfirmButton: false
        });

        storageForm.reset();
        loadStorages();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: err.message || 'ไม่สามารถเพิ่มข้อมูลได้'
        });
      }
    });
  }

  // โหลดข้อมูลทุกครั้งที่เปิดหน้า
  loadStorages();
}

/*********************************
 * DELETE STORAGE
 *********************************/
async function deleteStorage(id) {
  const result = await Swal.fire({
    title: 'ยืนยันการลบ?',
    text: 'ข้อมูลนี้จะไม่สามารถกู้คืนได้',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก'
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch(`/api/setting/storage/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) throw new Error();

    Swal.fire({
      icon: 'success',
      title: 'ลบแล้ว',
      timer: 1000,
      showConfirmButton: false
    });

    loadStorages();
  } catch {
    Swal.fire({
      icon: 'error',
      title: 'ลบไม่สำเร็จ'
    });
  }
}

/*********************************
 * MENU CLICK
 *********************************/
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.sub-menu button').forEach(btn => {
    btn.addEventListener('click', () => {
      const pageId = btn.dataset.page;
      openPage(pageId);
    });
  });
});







