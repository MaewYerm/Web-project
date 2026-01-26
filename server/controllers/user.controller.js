const db = require('../libs/mysql');


/* ===================== REGISTER ===================== */
exports.register = (req, res) => {
  const { username, password, firstname, lastname, role_id, gender_id } = req.body;

  db.query(
    `INSERT INTO user (username, password, firstname, lastname, role_id, gender_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [username, password, firstname, lastname, role_id, gender_id],
    (err) => {
      if (err) return res.status(500).send(err.message);
      res.redirect('/');
    }
  );
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน'
    });
  }

  const sql = `
    SELECT user_id, username, role_id
    FROM user
    WHERE username = ? AND password = ?
  `;

  db.query(sql, [username, password], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    if (rows.length === 0) {
      return res.status(401).json({
        error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    req.session.user = rows[0];
    res.json({ message: 'login success' });
  });
};


/* ===================== PROFILE ===================== */
exports.profile = (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  res.render('profile', {
    user: req.session.user
  });
};

/* ===================== LOGOUT ===================== */
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
