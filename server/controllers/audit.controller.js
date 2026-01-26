const db = require('../libs/mysql');


// ดูประวัติการทำรายการทั้งหมด


exports.getAll = (req, res) => {
  const sql = `
    SELECT
      a.audit_id,
      a.action_time,
      a.action_type,
      a.table_name,
      a.record_id,
      a.old_value,
      a.new_value,

      u.username,
      u.firstname,
      u.lastname
    FROM audit_log a
    LEFT JOIN user u
      ON a.User_user_id = u.user_id
    ORDER BY a.action_time DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};



// ดูประวัติของ record เดียว (เช่น beef_id เดียว)

exports.getByRecord = (req, res) => {
  const { table, recordId } = req.params;

  const sql = `
    SELECT *
    FROM audit_log
    WHERE table_name = ?
      AND record_id = ?
    ORDER BY action_time DESC
  `;

  db.query(sql, [table, recordId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};


// ใช้เรียกข้อมูลจาก controller อื่น

exports.createLog = ({
  table_name,
  record_id,
  action_type,
  old_value,
  new_value,
  user_id
}) => {
  const sql = `
    INSERT INTO audit_log
    (table_name, record_id, action_type, old_value, new_value, User_user_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    table_name,
    record_id,
    action_type,
    old_value,
    new_value,
    user_id || null
  ]);
};
