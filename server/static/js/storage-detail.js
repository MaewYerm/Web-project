
let storageDetail = {}

export async function initStock() {
    const res = await fetch('/api/stock')
    const data = await res.json()

    storageDetail = {}

    data.forEach(i => {
        const storageName = i.storage_name   // 👈 ใช้ชื่อจริงจาก DB

        if (!storageDetail[storageName]) {
            storageDetail[storageName] = []
        }
        storageDetail[storageName].push(i)
    })
}

export function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)

  return d.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}


export function getStorageDetail() {
    return storageDetail
}

export { storageDetail }   // 👈 ต้อง export ด้วย


export const gradeBadgeMap = {
    PREMIUM: 'gradebadge-PREMIUM',
    CHOICE: 'gradebadge-CHOICE',
    GOOD: 'gradebadge-GOOD',
    STANDARD: 'gradebadge-STANDARD'
}

export function getStockStatus(qty) {
    if (qty === 0) return { text: 'OUT OF STOCK', class: 'status-out' }
    if (qty <= 10) return { text: 'LOW STOCK', class: 'status-low' }
    return { text: 'IN STOCK', class: 'status-in' }
}

let currentOpenStorage = null

export function toggleStorageDetail(storageName) {
    const detailBlock = document.getElementById('storageDetail')
    const title = document.getElementById('detailTitle')
    const body = document.getElementById('detailBody')

    // ถ้าอันเดิมที่เปิดอยู่ → ซ่อน
    if (currentOpenStorage === storageName) {
        detailBlock.classList.add('hidden')
        currentOpenStorage = null
        return
    }

    // เปิดอันใหม่
    currentOpenStorage = storageName
    title.textContent = `รายการสินค้าใน ${storageName}`
    body.innerHTML = ""

    const items = storageDetail[storageName] || []

    if (items.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;">
                    ไม่มีรายการสินค้า
                </td>
            </tr>
        `
    } else {
        items.forEach(i => {
            const stock = getStockStatus(i.qty)
            const gradeKey = i.grade?.toUpperCase()
            body.innerHTML += `
                <tr>
                    <td>${i.lot_id}</td>
                    <td>${i.type}</td>
                    <td>${i.qty}</td>
                    <td>${i.weight}</td>
                     <td>${storageName}</td>
                    <td>${i.owner}</td>
                    <td>${i.aging} วัน</td>
                     <td>
                         <span class="gradebadge ${gradeBadgeMap[gradeKey] || ''}">
                         ${i.grade}
                         </span>
                     </td>
                    <td>
                         <span class="status ${stock.class}">
                         ${stock.text}
                         </span>
                    </td>
                    </tr>
                 `
        })

    }

    detailBlock.classList.remove('hidden')
    detailBlock.scrollIntoView({ behavior: 'smooth' })
}



