const db = require('../libs/mysql');
const path = require('path');

exports.getUsers = (callback) => {
  const sql = `
    SELECT
      user_id,
      username,
      firstname,
      lastname,
      birthday,
      citizen_id,
      address,
      nation,
      tel_main,
      tel_sub,
      email,
      role_id,
      gender_id
    FROM user
  `;

  db.query(sql, (err, rows) => {
    if (err) return callback(err);

    rows.forEach(u => {
      if (u.birthday) {
        const d = new Date(u.birthday);
        u.birthday = d.toLocaleDateString('th-TH', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      } else {
        u.birthday = '-';
      }
    });

    callback(null, rows);
  });
};

exports.profileImageById = (req, res) => {
  const userId = req.params.id;

  db.query(
    'SELECT profile_pic FROM user WHERE user_id = ?',
    [userId],
    (err, rows) => {
      if (err) return res.sendStatus(500);

      if (!rows.length || !rows[0].profile_pic) {
        return res.sendFile(
          path.join(__dirname, '../static/image/default.png')
        );
      }

      res.setHeader('Content-Type', 'image/png');
      res.send(rows[0].profile_pic);
    }
  );
};

exports.updateRole = (req, res) => {
  const { user_id, role_id } = req.body

  // 🔒 ห้ามแก้ role ตัวเอง
  if (req.session.user.id == user_id) {
    return res.json({ success: false, message: 'ไม่สามารถเปลี่ยนสิทธิ์ตัวเองได้' })
  }

  db.query(
    'UPDATE user SET role_id = ? WHERE user_id = ?',
    [role_id, user_id],
    err => {
      if (err) return res.json({ success: false })
      res.json({ success: true })
    }
  )
}


exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  db.query(
    'DELETE FROM user WHERE user_id = ?',
    [userId],
    err => {
      if (err) {
        console.error(err);
        return res.redirect('/dashboard?error=delete');
      }
      res.redirect('/dashboard');
    }
  );
};


// เพิ่มสถานที่เก็บ
exports.createStorage = (req, res) => {
  const { storage_name, capacity, temperature, storage_type } = req.body;

  const sql = `
    INSERT INTO storage 
    (storage_name, capacity, temperature, storage_type)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [storage_name, capacity, temperature, storage_type],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'เพิ่มสถานที่เก็บไม่สำเร็จ' });
      }
      res.status(201).json({
        message: 'เพิ่มสถานที่เก็บสำเร็จ',
        storage_id: result.insertId
      });
    }
  );
};

// ดึงสถานที่เก็บทั้งหมด
exports.getAllStorage = (req, res) => {
  const sql = `SELECT * FROM storage ORDER BY storage_id DESC`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'ดึงข้อมูลไม่สำเร็จ' });
    }
    res.json(results);
  });
};

// แก้ไขสถานที่เก็บ
exports.updateStorage = (req, res) => {
  const { id } = req.params;
  const { storage_name, capacity, temperature, storage_type } = req.body;

  const sql = `
    UPDATE storage SET
      storage_name = ?,
      capacity = ?,
      temperature = ?,
      storage_type = ?
    WHERE storage_id = ?
  `;

  db.query(
    sql,
    [storage_name, capacity, temperature, storage_type, id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'แก้ไขไม่สำเร็จ' });
      }
      res.json({ message: 'แก้ไขสถานที่เก็บสำเร็จ' });
    }
  );
};

// ลบสถานที่เก็บ
exports.deleteStorage = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM storage WHERE storage_id = ?`;

  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'ลบไม่สำเร็จ' });
    }
    res.json({ message: 'ลบสถานที่เก็บสำเร็จ' });
  });
};