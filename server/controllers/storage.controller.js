const db = require('../libs/mysql');

// ดู storage ทั้งหมด
exports.getAll = (req, res) => {
  const sql = `
    SELECT 
      s.storage_id,
      s.storage_name,
      s.capacity,
      s.temperature,
      s.storage_type_id,
      st.storage_type_name
    FROM storage s
    LEFT JOIN storage_type st
      ON s.storage_type_id = st.storage_type_id
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

exports.getById = (req, res) => {
  const sql = `
    SELECT 
      s.storage_id,
      s.storage_name,
      s.capacity,
      s.temperature,
      s.storage_type_id,
      st.storage_type_name
    FROM storage s
    LEFT JOIN storage_type st
      ON s.storage_type_id = st.storage_type_id
    WHERE s.storage_id = ?
  `;

  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (rows.length === 0)
      return res.status(404).json({ message: 'Storage not found' });
    res.json(rows[0]);
  });
};

// ดูชิ้นเนื้อทั้งหมดใน storage นั้น
exports.getBeefInStorage = (req, res) => {
  const sql = `
    SELECT
      b.beef_id,
      b.lot_id,
      b.qty,
      b.weight,
      b.receive_date,
      b.expired_date,
      b.aging,

      bt.type_name AS beef_type,
      g.grade_name,
      o.owner_name
    FROM beef_info b
    JOIN beef_type bt ON b.beef_type_id = bt.beef_type_id
    JOIN grade g ON b.grade_id = g.grade_id
    JOIN owner o ON b.owner_owner_id = o.owner_id
    WHERE b.storage_id = ?
  `;

  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};


exports.create = (req, res) => {
  const {
    storage_name,
    capacity,
    temperature,
    storage_type_id
  } = req.body;

  const sql = `
    INSERT INTO storage
    (storage_name, capacity, temperature, storage_type_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [storage_name, capacity, temperature, storage_type_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({
        message: 'Storage created',
        storage_id: result.insertId
      });
    }
  );
};


exports.update = (req, res) => {
  const sql = `
    UPDATE storage
    SET ?
    WHERE storage_id = ?
  `;

  db.query(sql, [req.body, req.params.id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Storage updated' });
  });
};

exports.remove = (req, res) => {
  db.query(
    'DELETE FROM storage WHERE storage_id = ?',
    [req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Storage deleted' });
    }
  );
};
