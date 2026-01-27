import { storageDetail } from './storage-data.js'
import { gradeBadgeMap } from "./storage-detail.js"
import { getStockStatus } from "./storage-detail.js"

const meatSelect = document.getElementById('meatSelect')
const searchInput = document.getElementById('searchInput')
const resultBox = document.getElementById('meatResult')

/* 🔹 รวมข้อมูลทุก LOT ออกมาเป็น array เดียว */
const allMeats = []

Object.entries(storageDetail).forEach(([storageName, items]) => {
  items.forEach(item => {
    allMeats.push({
      ...item,
      storage: storageName
    })
  })
})

/* 🔹 สร้าง dropdown อัตโนมัติ */
allMeats.forEach(meat => {
  const option = document.createElement('option')
  option.value = meat.lot
  option.textContent = `${meat.lot} - ${meat.type}`
  meatSelect.appendChild(option)
})


/* 🔹 ฟังก์ชันแสดง Card */
function renderMeatCard(meat) {
  if (!meat) {
    resultBox.classList.add('hidden')
    return
  }

  const stock = getStockStatus(meat.qty)

  const gradeClass = gradeBadgeMap[meat.grade] || ''


  resultBox.innerHTML = `
  <div class="meat-detail-wrapper">

    <!-- กล่องบน -->
    <div class="meat-top all-info-card">

      <!-- ข้อมูลพื้นฐาน -->
      <div class="info-box basic-info">
        <div class="box-header">
          <div class="box-header-left">
           <img src="/image/bigbox.png" class="icon-information">
           <h3>ข้อมูลพื้นฐาน</h3>
           </div>

         <span class="lot-badge">${meat.lot}</span>
        </div>

        <div class="row"><span>ชนิดเนื้อ</span><b>${meat.type}</b></div>
        <div class="row"><span>จำนวนคงเหลือ</span><b>${meat.qty} ชิ้น</b></div>
        <div class="row"><span>น้ำหนักรวม</span><b>${meat.weight} kg</b></div>
        <div class="row"><span>สถานที่เก็บ</span><b>${meat.storage}</b></div>
        <div class="row">
          <span>สถานะ</span>
          <span class="status ${stock.class}">${stock.text}</span>
        </div>
      </div>

      <!-- คุณภาพและการบ่ม -->
      <div class="info-box quality-info">
        <div class="box-header">
          <div class="box-header-left">
            <img src="/image/awardcrop.png" class="icon-information">
            <h3>คุณภาพและการบ่มเนื้อ</h3>
            </div>
        </div>
        <div class="row">
          <span>เกรดคุณภาพ</span>
          <span class="gradebadge ${gradeClass}">
            ${meat.grade}
          </span>
        </div>

        <div class="row">
          <span>ระยะเวลาการบ่ม (Aging)</span>
          <b>${meat.aging} วัน</b>
        </div>
      </div>

    </div>

    <!-- 🔹 ข้อมูลเจ้าของ -->
    <div class="info-box owner-info all-info-card">
      <div class="box-header">
        <div class="box-header-left">
      <img src="/image/human.png" class="icon-information">
      <h3>ข้อมูลเจ้าของชิ้นเนื้อ</h3>
        </div>
      </div>

      <div class="owner-grid">
        <div>
          <div class="label">ชื่อเจ้าของชิ้นเนื้อ</div>
          <div class="value">${meat.owner.name}</div>

          <div class="label">เบอร์โทรศัพท์</div>
          <div class="value">${meat.owner.phone}</div>

          <div class="label">อีเมล</div>
          <div class="value">${meat.owner.email}</div>
        </div>

        <div>
          <div class="label">LINE ID</div>
          <div class="value">${meat.owner.lineId}</div>

          <div class="label">Facebook</div>
          <div class="value">${meat.owner.facebook}</div>

          <div class="label">หมายเลขสมาชิกสหกรณ์</div>
          <div class="value">${meat.owner.memberId}</div>
        </div>
      </div>
    </div>

    <!-- 🔹 ข้อมูลวันที่ -->
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
          <b>${meat.receivedAt}</b>
        </div>

        <div>
          <span>วันที่หมดอายุ</span>
          <b>${meat.expireAt}</b>
        </div>
      </div>
    </div>

  </div>
`

  resultBox.classList.remove('hidden')
}


/* 🔹 เลือกจาก dropdown */
meatSelect.addEventListener('change', () => {
  const lot = meatSelect.value
  const meat = allMeats.find(m => m.lot === lot)
  renderMeatCard(meat)
})

/* 🔹 ค้นหาด้วยการพิมพ์ */
searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.trim()
  const meat = allMeats.find(m => m.lot.includes(keyword))
  renderMeatCard(meat)
})
