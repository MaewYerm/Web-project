const db = require('../libs/mysql');
const path = require('path');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

exports.register = async (req, res) => {


  const {
    username,
    password,
    firstname,
    lastname,
    birthday,
    citizen_id,
    nation,
    address,
    tel_main,
    tel_sub,
    email,
    gender_id
  } = req.body;

  // 🟢 รูป (อาจมี หรือ ไม่มี)
  const profilePic = req.file ? req.file.buffer : null;

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const sql = `
      INSERT INTO user
      (username, password, firstname, lastname, birthday,
       citizen_id, nation, address, tel_main, tel_sub,
       email, gender_id, role_id, profile_pic)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 2, ?)
    `;

    db.query(
      sql,
      [
        username,
        hashedPassword,
        firstname,
        lastname,
        birthday,
        citizen_id,
        nation,
        address,
        tel_main,
        tel_sub,
        email,
        gender_id,
        profilePic
      ],
      (err) => {
        if (err) {
          console.error(err);
          return res.redirect('/?register=fail');
        }

        return res.redirect('/?register=success');
      }
    );

  } catch (error) {
    console.error(error);
    return res.redirect('/?register=fail');
  }
};


exports.login = async (req, res) => {
  const { username, password } = req.body;

  const sql = `
    SELECT u.user_id, u.username, u.firstname, u.lastname,
           u.password, r.role_name
    FROM user u
    JOIN role r ON u.role_id = r.role_id
    WHERE u.username = ?
  `;

  db.query(sql, [username], async (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (rows.length === 0) {
      return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

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
        return res.sendFile(path.join(__dirname, '../static/image/default.png'));
      }

      res.setHeader('Content-Type', 'image/png'); // หรือ png
      res.send(rows[0].profile_pic);
    }
  );
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};


