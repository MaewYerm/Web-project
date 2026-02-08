const db = require('../libs/mysql');

// ================== INSERT ==================
exports.create = (req, res) => {
  const userId = req.session?.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Session expired' });
  }


  const {
    lot_id,
    qty,
    weight,
    receive_date,
    expired_date,
    aging,
    beef_type_id,
    grade_id,
    storage_id,

    owner_name,
    owner_tel,
    owner_email,
    owner_lineid,
    owner_facebook,
    owner_coop_id
  } = req.body;

  db.getConnection((err, conn) => {
    if (err) return res.status(500).json({ message: 'DB connection failed' });

    conn.beginTransaction(err => {
      if (err) {
        conn.release();
        return res.status(500).json(err);
      }

      // 1) INSERT OWNER
      const ownerSql = `
        INSERT INTO owner
        (owner_name, owner_tel, owner_email, owner_lineid, owner_facebook, owner_coop_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      conn.query(
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
          if (err) return rollback(conn, res, err);

          const owner_id = ownerResult.insertId;

          // 2) INSERT BEEF
          const beefSql = `
            INSERT INTO beef_info
            (lot_id, qty, weight, receive_date, expired_date, aging,
             beef_type_id, grade_id, Owner_owner_id, storage_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          conn.query(
            beefSql,
            [
              lot_id,
              Number(qty),
              Number(weight),
              receive_date,
              expired_date,
              aging,
              beef_type_id,
              grade_id,
              owner_id,
              storage_id
            ],
            (err, beefResult) => {
              if (err) return rollback(conn, res, err);

              // 3) AUDIT LOG
              const auditSql = `
                INSERT INTO audit_log
                (action_type, lot_id, beef_type,
                 old_qty, new_qty, qty_diff,
                 old_weight, new_weight, weight_diff,
                 action_by, action_at, reason)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
              `;

              conn.query(
                auditSql,
                [
                  'INSERT',
                  lot_id,
                  String(beef_type_id),
                  null,
                  Number(qty),
                  Number(qty),
                  null,
                  Number(weight),
                  Number(weight),
                  userId,
                  'เพิ่มชิ้นเนื้อ'
                ],
                err => {
                  if (err) return rollback(conn, res, err);

                  conn.commit(err => {
                    if (err) return rollback(conn, res, err);

                    conn.release();
                    res.json({
                      success: true,
                      beef_id: beefResult.insertId,
                      owner_id
                    });
                  });
                }
              );
            }
          );
        }
      );
    });
  });
};


// ================== DELETE ==================
exports.delete = (req, res) => {
  const userId = req.session?.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Session expired' });
  }

  const { lot_id } = req.body;

  db.getConnection((err, conn) => {
    if (err) return res.status(500).json({ message: 'DB connection failed' });

    conn.beginTransaction(err => {
      if (err) {
        conn.release();
        return res.status(500).json(err);
      }

      const findSql = `
        SELECT lot_id, qty, weight, beef_type_id, Owner_owner_id
        FROM beef_info
        WHERE lot_id = ?
      `;

      conn.query(findSql, [lot_id], (err, rows) => {
        if (err || rows.length === 0) {
          return rollback(conn, res, { message: 'ไม่พบข้อมูล' });
        }

        const beef = rows[0];
        const ownerId = beef.Owner_owner_id;

        conn.query(
          'DELETE FROM beef_info WHERE lot_id = ?',
          [lot_id],
          err => {
            if (err) return rollback(conn, res, err);

            const auditSql = `
              INSERT INTO audit_log
              (action_type, lot_id, beef_type,
               old_qty, new_qty, qty_diff,
               old_weight, new_weight, weight_diff,
               action_by, action_at, reason)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
            `;

            conn.query(
              auditSql,
              [
                'DELETE',
                beef.lot_id,
                String(beef.beef_type_id),
                beef.qty,
                null,
                -beef.qty,
                beef.weight,
                null,
                -beef.weight,
                userId,
                'ลบชิ้นเนื้อ'
              ],
              err => {
                if (err) return rollback(conn, res, err);

                conn.query(
                  'SELECT COUNT(*) AS cnt FROM beef_info WHERE Owner_owner_id = ?',
                  [ownerId],
                  (err, result) => {
                    if (err) return rollback(conn, res, err);

                    if (result[0].cnt === 0) {
                      conn.query('DELETE FROM owner WHERE owner_id = ?', [ownerId]);
                    }

                    conn.commit(err => {
                      if (err) return rollback(conn, res, err);

                      conn.release();
                      res.json({ message: 'Delete success' });
                    });
                  }
                );
              }
            );
          }
        );
      });
    });
  });
};


// ================== UPDATE ==================
exports.update = (req, res) => {
  const userId = req.session?.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Session expired' });
  }

  const { lot_id } = req.params;

  const {
    qty,
    weight,
    receive_date,
    expired_date,
    aging,
    beef_type_id,
    grade_id,
    storage_id,

    owner_name,
    owner_tel,
    owner_email,
    owner_lineid,
    owner_facebook,
    owner_coop_id,

    reason
  } = req.body;

  db.getConnection((err, conn) => {
    if (err) return res.status(500).json({ message: 'DB connection failed' });

    conn.beginTransaction(err => {
      if (err) {
        conn.release();
        return res.status(500).json(err);
      }

      const oldSql = `
        SELECT b.qty, b.weight, b.beef_type_id, b.Owner_owner_id
        FROM beef_info b
        WHERE b.lot_id = ?
      `;

      conn.query(oldSql, [lot_id], (err, rows) => {
        if (err || rows.length === 0) {
          return rollback(conn, res, { message: 'ไม่พบข้อมูล' });
        }

        const old = rows[0];

        const ownerSql = `
          UPDATE owner
          SET owner_name=?, owner_tel=?, owner_email=?,
              owner_lineid=?, owner_facebook=?, owner_coop_id=?
          WHERE owner_id = ?
        `;

        conn.query(
          ownerSql,
          [
            owner_name,
            owner_tel,
            owner_email,
            owner_lineid,
            owner_facebook,
            owner_coop_id,
            old.Owner_owner_id
          ],
          err => {
            if (err) return rollback(conn, res, err);

            const beefSql = `
              UPDATE beef_info
              SET qty=?, weight=?, receive_date=?, expired_date=?,
                  aging=?, beef_type_id=?, grade_id=?, storage_id=?
              WHERE lot_id=?
            `;

            conn.query(
              beefSql,
              [
                Number(qty),
                Number(weight),
                receive_date,
                expired_date,
                aging,
                beef_type_id,
                grade_id,
                storage_id,
                lot_id
              ],
              err => {
                if (err) return rollback(conn, res, err);

                const auditSql = `
                  INSERT INTO audit_log
                  (action_type, lot_id, beef_type,
                   old_qty, new_qty, qty_diff,
                   old_weight, new_weight, weight_diff,
                   action_by, action_at, reason)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
                `;

                conn.query(
                  auditSql,
                  [
                    'UPDATE',
                    lot_id,
                    String(beef_type_id),
                    old.qty,
                    Number(qty),
                    Number(qty) - old.qty,
                    old.weight,
                    Number(weight),
                    Number(weight) - old.weight,
                    userId,
                    reason?.trim() || 'แก้ไขชิ้นเนื้อ'

                  ],
                  err => {
                    if (err) return rollback(conn, res, err);

                    conn.commit(err => {
                      if (err) return rollback(conn, res, err);

                      conn.release();
                      res.json({ message: 'Update success' });
                    });
                  }
                );
              }
            );
          }
        );
      });
    });
  });
};

// ===== helper =====
function rollback(conn, res, err) {
  console.error(err);
  conn.rollback(() => {
    conn.release();
    res.status(500).json(err);
  });
}

exports.withdraw = (req, res) => {
  // ================== 1) USER จาก SESSION ==================
  const userId = req.session?.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Session expired' });
  }

  // ================== 2) รับค่า ==================
  const lot_id = req.body.lot_id;
  const withdrawQty = Number(req.body.qty);
  const withdrawWeight = Number(req.body.weight) || 0;
  const reason = req.body.reason?.trim() || 'เบิกชิ้นเนื้อ';

  if (!lot_id) {
    return res.status(400).json({ message: 'ไม่พบ lot_id' });
  }

  if (!Number.isFinite(withdrawQty) || withdrawQty <= 0) {
    return res.status(400).json({ message: 'จำนวนเบิกไม่ถูกต้อง' });
  }

  if (!Number.isFinite(withdrawWeight) || withdrawWeight < 0) {
    return res.status(400).json({ message: 'น้ำหนักเบิกไม่ถูกต้อง' });
  }

  // ================== 3) DB ==================
  db.getConnection((err, conn) => {
    if (err) return res.status(500).json(err);

    conn.beginTransaction(err => {
      if (err) return rollback(conn, res, err);

      // 🔒 lock แถว
      const findSql = `
        SELECT qty, weight, beef_type_id, Owner_owner_id
        FROM beef_info
        WHERE lot_id = ?
        FOR UPDATE
      `;

      conn.query(findSql, [lot_id], (err, rows) => {
        if (err || rows.length === 0) {
          return rollback(conn, res, { message: 'ไม่พบชิ้นเนื้อ' });
        }

        // ================== 4) ค่าเดิม ==================
        const oldQty = Number(rows[0].qty);
        const oldWeight = Number(rows[0].weight);
        const beefType = rows[0].beef_type_id;
        const ownerId = rows[0].Owner_owner_id;

        // ================== 5) คำนวณ ==================
        const newQty = oldQty - withdrawQty;
        const newWeight = oldWeight - withdrawWeight;

        if (newQty < 0) {
          return rollback(conn, res, { message: 'จำนวนเบิกมากกว่าคงเหลือ' });
        }

        if (newWeight < 0) {
          return rollback(conn, res, { message: 'น้ำหนักเบิกมากกว่าคงเหลือ' });
        }

        // ================== 6) audit + commit ==================
        const writeAuditAndCommit = () => {
          const auditSql = `
            INSERT INTO audit_log
            (action_type, lot_id, beef_type,
             old_qty, new_qty, qty_diff,
             old_weight, new_weight, weight_diff,
             action_by, action_at, reason)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
          `;

          conn.query(
            auditSql,
            [
              'WITHDRAW',
              lot_id,
              String(beefType),
              oldQty,
              newQty,
              -withdrawQty,
              oldWeight,
              newWeight,
              -withdrawWeight,
              userId,
              reason
            ],
            err => {
              if (err) return rollback(conn, res, err);

              conn.commit(err => {
                if (err) return rollback(conn, res, err);
                conn.release();
                res.json({ message: 'Withdraw success' });
              });
            }
          );
        };

        // ================== 7) เบิกหมด → ลบ beef + owner ==================
        if (newQty === 0) {
          conn.query(
            'DELETE FROM beef_info WHERE lot_id = ?',
            [lot_id],
            err => {
              if (err) return rollback(conn, res, err);

              conn.query(
                'DELETE FROM owner WHERE owner_id = ?',
                [ownerId],
                err => {
                  if (err) return rollback(conn, res, err);
                  writeAuditAndCommit();
                }
              );
            }
          );
        }
        // ================== 8) ยังเหลือ → UPDATE ==================
        else {
          conn.query(
            'UPDATE beef_info SET qty = ?, weight = ? WHERE lot_id = ?',
            [newQty, newWeight, lot_id],
            err => {
              if (err) return rollback(conn, res, err);
              writeAuditAndCommit();
            }
          );
        }
      });
    });
  });
};




