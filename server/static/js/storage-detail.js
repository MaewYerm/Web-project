
import { storageDetail } from './storage-data.js'

// const storageDetail = {
//     "Freezer A1": [
//         {
//             lot: "LOT-2025-11",
//             type: "Ribeye",
//             qty: 42,
//             weight: 102.5,
//             owner: "ฟาร์มโคขุนดี",
//             aging: "20",
//             grade: "PREMIUM",
//         },
//         {
//             lot: "LOT-2025-20",
//             type: "Striploin",
//             qty: 10,
//             weight: 20,
//             owner: "ฟาร์มสุขใจ",
//             aging: "21",
//             grade: "CHOICE",
//         }
//     ],
//     "Cold Storage A1": [],
//     "Cold Storage A2": [
//         {
//             lot: "LOT-2025-20",
//             type: "Striploin",
//             qty: 10,
//             weight: 20,
//             owner: "ฟาร์มสุขใจ",
//             aging: "10",
//             grade: "STANDARD",
//         }
//     ]
// }

const gradeBadgeMap = {
    PREMIUM: 'gradebadge-PREMIUM',
    CHOICE: 'gradebadge-CHOICE',
    GOOD: 'gradebadge-GOOD',
    STANDARD: 'gradebadge-STANDARD'
}

function getStockStatus(qty) {
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
            body.innerHTML += `
                <tr>
                    <td>${i.lot}</td>
                    <td>${i.type}</td>
                    <td>${i.qty}</td>
                    <td>${i.weight}</td>
                    <td>${storageName}</td>
                    <td>${i.owner}</td>
                    <td>${i.aging} วัน</td>
                    <td>
                        <span class="gradebadge ${gradeBadgeMap[i.grade]}">${i.grade}</span>
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

