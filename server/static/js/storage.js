import { toggleStorageDetail, getStorageDetail, initStock }
  from './storage-detail.js'



async function fetchStorages() {
  const res = await fetch('/api/storage')
  return await res.json()
}

const storageList = document.getElementById('storageList')

function calcStorageSummary(storageName) {
  const storageDetail = getStorageDetail()
  const items = storageDetail[storageName] || []

  let totalWeight = 0
  let totalItems = 0

  items.forEach(i => {
    totalWeight += i.weight
    totalItems += i.qty
  })

  return { totalWeight, totalItems }
}


function calcUsage(weight, capacity) {
  if (!capacity || capacity === 0) return 0
  return Math.min((weight / capacity) * 100, 100)
}

function getUsageColor(percent) {
  if (percent >= 80) return '#ef4444'
  if (percent >= 50) return '#facc15'
  return '#4ade80'
}

async function initStorageCards() {
  const storages = await fetchStorages()
  console.log('storages =', storages)

  storageList.innerHTML = ''

  storages.forEach(s => {
    const summary = calcStorageSummary(s.storage_name)
    const usagePercent = calcUsage(summary.totalWeight, s.capacity)
    const color = getUsageColor(usagePercent)

    const card = document.createElement('div')
    card.className = 'storage-card'

    card.innerHTML = `
      <div class='storage-card-title'>
        <img src="/image/location_on.png" class="storage-card-logo">
        <h3>${s.storage_name}</h3>
      </div>

      <div class="type">${s.storage_type || '-'}</div>

      <div class="info-layout">
        <div>
          <div class="temp">อุณหภูมิที่กำหนด</div>
          <div class="info">จำนวนรายการ</div>
          <div class="info">น้ำหนักรวม</div>
          <div class="info">ความจุที่จัดเก็บ</div>
          <div class="info">การใช้งาน</div>
        </div>

        <div class="info-right">
          <div class="temp-icon temp-text">🌡 ${s.temperature ?? ''}</div>
          <div class="subinfo">${summary.totalItems} รายการ</div>
          <div class="subinfo">${summary.totalWeight} kg</div>
          <div class="subinfo">${s.capacity} kg</div>
          <div class="subinfo">${usagePercent.toFixed(1)} %</div>
        </div>
      </div>

      <div class="usage-bar">
        <div class="usage-fill"
          style="width:${usagePercent}%; background:${color}">
        </div>
      </div>
    `

    card.addEventListener('click', () => {
      toggleStorageDetail(s.storage_name)
    })

    storageList.appendChild(card)
  })
}

async function initPage() {
  await initStock() 
  await initStorageCards()
}

initPage()

console.log('storage.js loaded')




