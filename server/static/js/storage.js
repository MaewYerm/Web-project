import { storages } from './storage-data.js'
import { toggleStorageDetail } from './storage-detail.js'
import { storageDetail } from './storage-data.js'

// const storages = [
//     {
//         id: 1,
//         name: "Freezer A1",
//         type: "ตู้แช่แข็ง",
//         temp: -2,
//         items: 3,
//         capacity: 500,
//     },
//     {
//         id: 2,
//         name: "Cold Storage A1",
//         type: "ห้องเย็น",
//         temp: 0,
//         items: 0,
//         capacity: 600,
//     },
//     {
//         id: 3,
//         name: "Cold Storage A2",
//         type: "ห้องเย็น",
//         temp: 4,
//         items: 1,
//         capacity: 800,
//     }
// ]

const storageList = document.getElementById('storageList')

function calcStorageSummary(storageName) {
    const items = storageDetail[storageName] || []

    let totalWeight = 0
    let totalItems = 0

    items.forEach(i => {
        totalWeight += i.weight
        totalItems += i.qty
    })

    return {
        totalWeight,
        totalItems
    }
}

function calcUsage(weight, capacity) {
    if (capacity === 0) return 0
    return Math.min((weight / capacity) * 100, 100)
}

storages.forEach(s => {
    const summary = calcStorageSummary(s.name)
    const usagePercent = calcUsage(summary.totalWeight, s.capacity)

    function getUsageColor(percent) {
    if (percent >= 80) return '#ef4444'
    if (percent >= 50) return '#facc15'
    return '#4ade80'
    }
    const color = getUsageColor(usagePercent)

    const card = document.createElement('div')
    card.className = 'storage-card'

    card.innerHTML = `
    <h3>${s.name}</h3>
    <div class="type">${s.type}</div>

    <div class="info-layout">
     <div>
        <div class="temp">อุณหภูมิที่กำหนด</div>    
        <div class="info">จำนวนรายการ</div>   
        <div class="info">น้ำหนักรวม</div>
        <div class="info">การใช้งาน</div>
     </div>

     <div class="info-right">
        <div class="temp-icon temp-text">🌡 ${s.temp}</div>
        <div class="subinfo">${summary.totalItems} รายการ</div>
        <div class="subinfo">${summary.totalWeight} kg</div>
        <div class="subinfo">${usagePercent.toFixed(1)} %</div>
     </div>
    </div>

    <div class="usage-bar">
    <div class="usage-fill"
     style="width:${usagePercent}%; background:${color}">
    </div>
    </div>
  `
    storageList.appendChild(card)

    card.addEventListener('click', () => {
        toggleStorageDetail(s.name)
    })

})




