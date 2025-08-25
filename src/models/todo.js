// import { ERROR } from "sqlite3";
import { getDatabase } from "../database/connect.js";

export class Todo {
  static async create(title, descriptiom, userId) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO todos (title , decription , user_id) VALUES (?, ?, ?)";
      db.run(sql, [title, descriptiom, userId], function (err) {
        if (err) {
          reject(err);
        } else {
          //yeh create karke return kar dega

          Todo.findById(this.lastID).then(resolve).catch(reject);
        }
      });
    });
  }

  static async findById(id) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM todos WHERE id = ?";

      db.get(sql, [id], function (err, row) {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async findByUserId(userId) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC";

      db.all(sql, [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row || []);
      });
    });
  }

  static async update(id, updates, userId) {
    const db = getDatabase();

    return new Promise((reoslve, reject) => {
      const sql =
        "UPDATE todos SET title = COALESCE(?, title),  description = COALESCE(?, description), completed = COALESCE(?, completed), updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?";

        db.run(sql , [id , updates , userId] , function(err) {
            if(err) {
                reject(err);
            }else if(this.changes === 0){
                reject(new ERROR("Todos is Invalid or not authorised"));
            }else{
                Todo.findById(id).then(resolve).catch(reject);
            }
        });
    });
  }

  static async delete(id , userId){
    const db = getDatabase();

    return new Promise((resolve , reject) => {
        const sql = 'DELETE FROM todos WHERE id = ? AND user_id = ?';

        db.run(sql , [id , userId] , function(err) {
            if(err) {
                reject(err);
            }else if(this.changes === 0){
                reject(new ERROR("Invalid todo or not authorised"));
            }else{
                resolve(true);
            }
        })
    })
  }
}
