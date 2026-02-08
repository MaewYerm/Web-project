async function loadHistorySummary() {
    const res = await fetch('/api/audit/summary');
    const s = await res.json();

    const cards = document.querySelectorAll('.his-card h1');

    cards[0].textContent = s.total || 0;
    cards[1].textContent = s.insert_count || 0;
    cards[2].textContent = s.update_count || 0;
    cards[3].textContent = s.delete_count || 0;
    cards[4].textContent = s.withdraw_count || 0;
}

function renderHistoryTable(data) {
    const tbody = document.getElementById('history-body');
    tbody.innerHTML = '';

    if (!data.length) {
        tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align:center;">ไม่มีข้อมูล</td>
      </tr>
    `;
        return;
    }

    data.forEach(row => {
        const tr = document.createElement('tr');
        const actionColorMap = {
            INSERT: 'green',
            UPDATE: 'blue',
            DELETE: 'red',
            WITHDRAW: 'orange',
            EXPIRE: 'red'
        };

        const actionClass = actionColorMap[row.action_type] || '';



        tr.innerHTML = `
      <td>${new Date(row.action_at).toLocaleString()}</td>
      <td class="${actionClass}">${row.action_type}</td>
      <td>${row.lot_id}</td>
      <td>${row.beef_type}</td>
      <td>${row.old_qty ?? '-'}</td>
      <td>${row.new_qty ?? '-'}</td>
      <td style="color:${row.qty_diff > 0 ? 'green' : row.qty_diff < 0 ? 'red' : 'inherit'}; font-weight: bold;">
      ${row.qty_diff > 0 ? '+' : ''}${row.qty_diff}
      </td>

      <td>${row.new_weight ?? '-'}</td>
      <td>${row.firstname || ''} ${row.lastname || ''}</td>
      <td>${row.reason || ''}</td>
    `;

        tbody.appendChild(tr);
    });
}

async function loadHistory() {
    const action = document.querySelector('select[name="action"]').value;
    const range = document.querySelector('select[name="range"]').value;

    const res = await fetch(
        `/api/audit?action=${action}&range=${range}`
    );

    const data = await res.json();
    renderHistoryTable(data);
}

document.querySelectorAll('.history-filter select')
    .forEach(s => s.addEventListener('change', loadHistory));

loadHistorySummary();
loadHistory();

