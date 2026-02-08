const db = require('../libs/mysql');

exports.getAll = (req, res) => {
  const sql = `
    SELECT
      s.storage_id,
      s.storage_name,
      s.capacity,
      s.temperature,
      s.storage_type,
      IFNULL(SUM(b.weight), 0) AS totalWeight,
      IFNULL(SUM(b.qty), 0) AS totalItems
    FROM storage s
    LEFT JOIN beef_info b
      ON s.storage_id = b.storage_id
    GROUP BY s.storage_id
  `

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result)
  })
}


// สร้างสถานที่จัดเก็บใหม่
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
