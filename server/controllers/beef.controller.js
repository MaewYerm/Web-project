const db = require('../libs/mysql');


exports.create = (req, res) => {
  const {
    // -------- beef info --------
    lot_id,
    qty,
    weight,
    receive_date,
    expired_date,
    aging,
    beef_type_id,
    grade_id,
    storage_id,

    // -------- owner info --------
    owner_name,
    owner_tel,
    owner_email,
    owner_lineid,
    owner_facebook,
    owner_coop_id
  } = req.body;

  // 1) เพิ่ม owner
  const ownerSql = `
    INSERT INTO owner
    (owner_name, owner_tel, owner_email, owner_lineid, owner_facebook, owner_coop_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    ownerSql,
    [
      owner_name,
      owner_tel,
      owner_email,
      owner_lineid,
      owner_facebook,
      owner_coop_id
    ],
    (err, ownerResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      const owner_id = ownerResult.insertId;

      // 2) เพิ่ม beef_info โดยอ้างถึง owner_id
      const beefSql = `
        INSERT INTO beef_info
        (lot_id, qty, weight, receive_date, expired_date, aging,
         beef_type_id, grade_id, owner_owner_id, storage_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        beefSql,
        [
          lot_id,
          qty,
          weight,
          receive_date,
          expired_date,
          aging,
          beef_type_id,
          grade_id,
          owner_id,
          storage_id
        ],
        (err, beefResult) => {
          if (err) {
            console.error(err);
            return res.status(500).json(err);
          }

          res.json({
            message: 'Beef info created successfully',
            beef_id: beefResult.insertId,
            owner_id: owner_id
          });
        }
      );
    }
  );
};


// ดูเนื้อทั้งหมด (แสดงข้อมูลหลัก)

exports.getAll = (req, res) => {
  const sql = `
    SELECT
      b.beef_id,
      b.lot_id,
      b.qty,
      b.weight,
      b.expired_date,
      b.aging,

      bt.type_name AS beef_type,
      g.grade_name,
      s.storage_name

    FROM beef_info b
    JOIN beef_type bt ON b.beef_type_id = bt.beef_type_id
    JOIN grade g ON b.grade_id = g.grade_id
    JOIN storage s ON b.storage_id = s.storage_id
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};


// ดูเนื้อทีละชิ้น (รายละเอียดเต็ม)

exports.getById = (req, res) => {
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

      o.owner_name,
      o.owner_tel,
      o.owner_email,

      s.storage_name,
      s.temperature,
      st.storage_type_name

    FROM beef_info b
    JOIN beef_type bt ON b.beef_type_id = bt.beef_type_id
    JOIN grade g ON b.grade_id = g.grade_id
    JOIN owner o ON b.owner_owner_id = o.owner_id
    JOIN storage s ON b.storage_id = s.storage_id
    JOIN storage_type st ON s.storage_type_id = st.storage_type_id
    WHERE b.beef_id = ?
  `;

  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (rows.length === 0)
      return res.status(404).json({ message: 'Not found' });

    res.json(rows[0]);
  });
};

// แก้ไขข้อมูลเนื้อ

exports.update = (req, res) => {
  const sql = `
    UPDATE beef_info SET ?
    WHERE beef_id = ?
  `;

  db.query(sql, [req.body, req.params.id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Beef updated' });
  });
};


// ลบชิ้นเนื้อ
exports.remove = (req, res) => {
  db.query(
    'DELETE FROM beef_info WHERE beef_id = ?',
    [req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Beef deleted' });
    }
  );
};
