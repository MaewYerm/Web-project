const db = require('../libs/mysql');

exports.getAll = (req, res) => {
  db.query(
    'SELECT grade_id, grade_name FROM grade',
    (err, rows) => {
      if (err) return res.status(500).json(err)
      res.json(rows)
    }
  )
}
