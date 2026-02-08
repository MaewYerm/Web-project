const db = require('../libs/mysql')

exports.getAll = (req, res) => {
  db.query(
    'SELECT beef_type_id, type_name FROM beef_type',
    (err, rows) => {
      if (err) return res.status(500).json(err)
      res.json(rows)
    }
  )
}
