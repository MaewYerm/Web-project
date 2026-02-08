const db = require('../libs/mysql');

exports.list = (req, res) => {
  const { action = 'ALL', range = 'ALL' } = req.query;

  let where = [];
  let params = [];

  if (action !== 'ALL') {
    where.push('a.action_type = ?');
    params.push(action);
  }

  if (range === 'TODAY') {
    where.push('DATE(a.action_at) = CURDATE()');
  } else if (range === '7DAYS') {
    where.push('a.action_at >= NOW() - INTERVAL 7 DAY');
  } else if (range === '30DAYS') {
    where.push('a.action_at >= NOW() - INTERVAL 30 DAY');
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const sql = `
    SELECT 
      a.*, 
      u.username,
      u.firstname,
      u.lastname
    FROM audit_log a
    LEFT JOIN user u ON a.action_by = u.user_id
    ${whereSql}
    ORDER BY a.action_at DESC
    LIMIT 200
  `;

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

exports.summary = (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS total,
      SUM(action_type='INSERT') AS insert_count,
      SUM(action_type='UPDATE') AS update_count,
      SUM(action_type='DELETE') AS delete_count,
      SUM(action_type='WITHDRAW') AS withdraw_count,
      SUM(action_type='EXPIRE') AS expire_count
    FROM audit_log
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows[0]);
  });
};

