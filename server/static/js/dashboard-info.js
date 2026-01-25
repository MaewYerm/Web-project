import { storageDetail } from "./storage-data.js"
import { gradeBadgeMap } from "./storage-detail.js"
import { getStockStatus } from "./storage-detail.js"


//<!-- สรุปข้อมูลไป DASHBOARD -->
let totalQty = 0
let totalWeight = 0
let lowStockCount = 0
let nearExpireCount = 0   // เดี๋ยวใช้ภายหลัง

Object.values(storageDetail).forEach(items => {
  items.forEach(i => {
    totalQty += i.qty
    totalWeight += i.weight

    if (i.qty > 0 && i.qty < 10) {
      lowStockCount++
    }

    // ถ้ายังไม่มีวันหมดอายุ ข้ามไปก่อนได้
  })
})

document.getElementById('totalQty').textContent = totalQty
document.getElementById('totalWeight').textContent = totalWeight.toFixed(1)
document.getElementById('lowStockCount').textContent = lowStockCount
document.getElementById('nearExpireCount').textContent = nearExpireCount


//<!-- เพิ่มข้อมูลรายการ -->
const tbody = document.getElementById("stockTableBody")
tbody.innerHTML = "" // ลบ "ไม่พบรายการ..."

//กำหนดวันหมดอายุ
function getStatus(expireAt) {
  const today = new Date()
  const expire = new Date(expireAt)
  const diff = (expire - today) / (1000 * 60 * 60 * 24)

  if (diff < 0) return "หมดอายุ"
  if (diff <= 7) return "ใกล้หมดอายุ"
  return "ปกติ"
}

let hasData = false

Object.entries(storageDetail).forEach(([location, items]) => {
  items.forEach(item => {
    const stock = getStockStatus(item.qty)
    hasData = true

    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td>${item.lot}</td>
      <td>${item.type}</td>
      <td>${item.qty}</td>
      <td>${item.weight}</td>
      <td>${location}</td>
      <td>${item.owner}</td>
      <td>${item.receivedAt}</td>
      <td>${item.expireAt}</td>     
      <td>${getStatus(item.expireAt)}</td>
      <td>
        <span class="gradebadge ${gradeBadgeMap[item.grade]}">${item.grade}</span>
      </td>
      <td>
        <span class="status ${stock.class}">${stock.text}</span>
      </td>
      <td>
        <button class="btn-sm">ดู</button>
      </td>
    `
    tbody.appendChild(tr)
  })
})

if (!hasData) {
  tbody.innerHTML = `
    <tr>
      <td colspan="12" class="empty">ไม่พบรายการสินค้าในคลัง</td>
    </tr>
  `
}


document.getElementById("searchInput").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const rows = document.querySelectorAll("#stockTableBody tr");

  rows.forEach(row => {
    const rowText = row.innerText.toLowerCase();
    row.style.display = rowText.includes(keyword) ? "" : "none";
  });
});



