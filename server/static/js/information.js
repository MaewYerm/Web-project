import { gradeBadgeMap, getStockStatus, formatDate } from "./storage-detail.js"

const meatSelect = document.getElementById('meatSelect')
const searchInput = document.getElementById('searchInput')
const resultBox = document.getElementById('meatResult')

let allMeats = []

/* 🔹 ดึงข้อมูล stock จาก API */
async function loadStockData() {
  const res = await fetch('/api/stock')
  const data = await res.json()

  allMeats = data

  buildDropdown()
}

/* 🔹 สร้าง dropdown */
function buildDropdown() {
  meatSelect.innerHTML = `<option value="">-- เลือกรายการ --</option>`

  allMeats.forEach(meat => {
    const option = document.createElement('option')
    option.value = meat.lot_id
    option.textContent = `${meat.lot_id} - ${meat.type}`
    meatSelect.appendChild(option)
  })
}


/* 🔹 render card */
function renderMeatCard(meat) {
  if (!meat) {
    resultBox.classList.add('hidden')
    return
  }

  const stock = getStockStatus(meat.qty)
  const gradeKey = meat.grade?.toUpperCase()

  resultBox.innerHTML = `
  <div class="meat-detail-wrapper">

    <!-- ข้อมูลพื้นฐาน -->
    <div class="meat-top all-info-card">
      <div class="info-box basic-info">
        <div class="box-header">
          <div class="box-header-left">
            <img src="/image/bigbox.png" class="icon-information">
            <h3>ข้อมูลพื้นฐาน</h3>
          </div>
          <span class="lot-badge">${meat.lot_id}</span>
        </div>

        <div class="row"><span>ชนิดเนื้อ</span><b>${meat.type}</b></div>
        <div class="row"><span>จำนวนคงเหลือ</span><b>${meat.qty} ชิ้น</b></div>
        <div class="row"><span>น้ำหนักรวม</span><b>${meat.weight} kg</b></div>
        <div class="row"><span>สถานที่เก็บ</span><b>${meat.storage_name}</b></div>
        <div class="row">
          <span>สถานะคลัง</span>
          <span class="status ${stock.class}">${stock.text}</span>
        </div>
      </div>

      <!-- คุณภาพ -->
      <div class="info-box quality-info">
        <div class="box-header">
          <div class="box-header-left">
            <img src="/image/awardcrop.png" class="icon-information">
            <h3>คุณภาพและการบ่มเนื้อ</h3>
          </div>
        </div>

        <div class="row">
          <span>เกรดคุณภาพ</span>
          <span class="gradebadge ${gradeBadgeMap[gradeKey] || ''}">
            ${meat.grade}
          </span>
        </div>

        <div class="row">
          <span>ระยะเวลาการบ่ม</span>
          <b>${meat.aging} วัน</b>
        </div>
      </div>
    </div>

    <!-- เจ้าของ -->
    <div class="info-box owner-info all-info-card">
      <div class="box-header">
        <div class="box-header-left">
          <img src="/image/human.png" class="icon-information">
          <h3>ข้อมูลเจ้าของชิ้นเนื้อ</h3>
        </div>
      </div>

      <div class="row">ชื่อเจ้าของ : ${meat.owner}</div>
      <div class="row">เบอร์โทร : ${meat.owner_tel}</div>
      <div class="row">หมายเลขสหกรณ์ : ${meat.owner_coop_id}</div>
      <div class="row">Email : ${meat.owner_email}</div>
      <div class="row">LineID : ${meat.owner_lineid}</div>
      <div class="row">Facebook : ${meat.owner_facebook}</div>
    </div>

    <!-- วันที่ -->
    <div class="info-box date-info all-info-card">
      <div class="box-header">
        <div class="box-header-left">
          <img src="/image/calen.png" class="icon-information">
          <h3>ข้อมูลวันที่</h3>
        </div>
      </div>

      <div class="date-grid">
        <div>
          <span>วันที่รับเข้า</span>
          <b>${formatDate(meat.receive_date)}</b>
        </div>
        <div>
          <span>วันหมดอายุ</span>
          <b>${formatDate(meat.expired_date)}</b>
        </div>
      </div>
    </div>

  </div>
  `

  resultBox.classList.remove('hidden')
}

/* 🔹 dropdown change */
meatSelect.addEventListener('change', () => {
  const lotId = meatSelect.value
  const meat = allMeats.find(m => String(m.lot_id) === lotId)
  renderMeatCard(meat)
})

/* 🔹 search */
searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.trim()
  const meat = allMeats.find(m => m.lot_id.includes(keyword))
  renderMeatCard(meat)
})

/* init */
loadStockData()
