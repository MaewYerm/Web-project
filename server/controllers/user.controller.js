const db = require('../libs/mysql');

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

  const sql = `
    SELECT 
      u.user_id,
      u.username,
      u.firstname,
      u.lastname,
      r.role_name
    FROM user u
    JOIN role r ON u.role_id = r.role_id
    WHERE username = ? AND password = ?
  `;

  db.query(sql, [username, password], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    if (rows.length === 0) {
      return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    const user = rows[0];

    req.session.user = {
      id: user.user_id,
      username: user.username,
      fullname: `${user.firstname} ${user.lastname}`,
      role: user.role_name
    };

    res.json(req.session.user);
  });
};


exports.profile = (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  res.render('profile', {
    user: req.session.user
  });
};

exports.profileImage = (req, res) => {
  const userId = req.session.user.id;

  db.query(
    'SELECT profile_pic FROM user WHERE user_id = ?',
    [userId],
    (err, rows) => {
      if (err) return res.sendStatus(500);
      if (!rows.length || !rows[0].profile_pic) {
        return res.sendFile(path.join(__dirname, '../public/image/default.png'));
      }

      res.setHeader('Content-Type', 'image/jpeg'); // หรือ png
      res.send(rows[0].profile_pic);
    }
  );
};


exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
