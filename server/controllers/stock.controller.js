const db = require('../libs/mysql')

exports.getAll = (req, res) => {
  const sql = `
      SELECT
    b.beef_id,
    b.lot_id,
    b.qty,
    b.weight,
    b.receive_date,
    b.expired_date,
    b.aging,
    s.storage_name,
    s.storage_id,
    bt.type_name AS type,
    g.grade_name AS grade,
    b.beef_type_id,
    b.grade_id,
    o.owner_name AS owner,
    o.owner_tel,
    o.owner_coop_id,
    o.owner_email,
    o.owner_lineid,
    o.owner_facebook

  FROM beef_info b
  LEFT JOIN storage s ON b.storage_id = s.storage_id
  LEFT JOIN beef_type bt ON b.beef_type_id = bt.beef_type_id
  LEFT JOIN grade g ON b.grade_id = g.grade_id
  LEFT JOIN owner o ON b.owner_owner_id = o.owner_id

  `

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result)
  })
};
