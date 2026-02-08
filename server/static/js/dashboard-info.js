import { initStock, getStorageDetail } from "./storage-detail.js"
import { gradeBadgeMap, getStockStatus , formatDate} from "./storage-detail.js"

// ================== LOAD DATA ==================
async function initDashboard() {
  await initStock()                         // 🔹 โหลด /api/stock
  const storageDetail = getStorageDetail()  // 🔹 ดึงข้อมูลหลังโหลด

  renderSummary(storageDetail)
  renderTable(storageDetail)
}

initDashboard()

// ================== SUMMARY ==================
function renderSummary(storageDetail) {
  let totalQty = 0
  let totalWeight = 0
  let lowStockCount = 0
  let nearExpireCount = 0

  Object.values(storageDetail).forEach(items => {
    items.forEach(i => {
      totalQty += i.qty
      totalWeight += i.weight

      if (i.qty > 0 && i.qty < 10) {
        lowStockCount++
      }

      if (i.expired_date && getExpireStatus(i.expired_date) === "ใกล้หมดอายุ") {
        nearExpireCount++
      }
    })
  })

  document.getElementById('totalQty').textContent = totalQty
  document.getElementById('totalWeight').textContent = totalWeight.toFixed(1)
  document.getElementById('lowStockCount').textContent = lowStockCount
  document.getElementById('nearExpireCount').textContent = nearExpireCount
}

// ================== TABLE ==================
function renderTable(storageDetail) {
  const tbody = document.getElementById("stockTableBody")
  tbody.innerHTML = ""

  let hasData = false

  Object.entries(storageDetail).forEach(([storageName, items]) => {
    items.forEach(item => {
      hasData = true
      const stock = getStockStatus(item.qty)
      const gradeKey = item.grade?.toUpperCase()

      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td>${item.lot_id}</td>
        <td>${item.type}</td>
        <td>${item.qty}</td>
        <td>${item.weight}</td>
        <td>${storageName}</td>
        <td>${item.owner}</td>
        <td>${formatDate(item.receive_date)}</td>
        <td>${formatDate(item.expired_date)}</td>
        <td>${getExpireStatus(item.expired_date)}</td>
        <td>
          <span class="gradebadge ${gradeBadgeMap[gradeKey] || ''}">
            ${item.grade}
          </span>
        </td>
        <td>
          <span class="status ${stock.class}">
            ${stock.text}
          </span>
        </td>
        <td>
          <button class="btn-sm btn-withdraw theme-font" data-item='${JSON.stringify(item)}'>
          <img src="/image/withdraw.png">
          </button>
          <button class="btn-sm btn-edit" data-item='${JSON.stringify(item)}'>
          <img src="/image/Edit.png">
          </button>
          <button class="btn-sm btn-delete" data-lot="${item.lot_id}">
          <img src="/image/bin.png">
          </button>
        </td>
      `
      tbody.appendChild(tr)
    })
  })

  // 🔹 ไม่มีข้อมูลเลย
  if (!hasData) {
    tbody.innerHTML = `
      <tr>
        <td colspan="12" class="empty">
          ไม่พบรายการสินค้าในคลัง
        </td>
      </tr>
    `
  }
}

// ================== EXPIRE STATUS ==================
function getExpireStatus(expired_date) {
  const today = new Date()
  const expire = new Date(expired_date)
  const diff = (expire - today) / (1000 * 60 * 60 * 24)

  if (diff < 0) return "หมดอายุ"
  if (diff <= 7) return "ใกล้หมดอายุ"
  return "ปกติ"
}

// ================== SEARCH ==================
document.getElementById("searchInput").addEventListener("input", function () {
  const keyword = this.value.toLowerCase()
  const rows = document.querySelectorAll("#stockTableBody tr")

  rows.forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(keyword)
      ? ""
      : "none"
  })
})
