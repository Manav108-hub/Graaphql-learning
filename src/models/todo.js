import { getDatabase } from "../database/connect.js";

export class Todo {
  // Fixed method name and parameters
  static async createTodo(title, description, userId) {
    console.log("Creating todo:", { title, description, userId });
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      // Fixed column name: description (not decription)
      const sql = "INSERT INTO todos (title, description, user_id) VALUES (?, ?, ?)";
      db.run(sql, [title, description, userId], function (err) {
        if (err) {
          console.error("Error creating todo:", err);
          reject(err);
        } else {
          console.log("Todo created with ID:", this.lastID);
          // Return the created todo
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
          console.error("Error finding todo by ID:", err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async findByUserId(userId) {
    console.log("Finding todos for user:", userId);
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC";

      db.all(sql, [userId], (err, rows) => {
        if (err) {
          console.error("Error finding todos by user ID:", err);
          reject(err);
        } else {
          console.log("Found todos:", rows?.length || 0);
          resolve(rows || []);
        }
      });
    });
  }

  static async update(id, updates, userId) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      // Fixed parameter order and destructuring
      const { title, description, completed } = updates;
      const sql = `
        UPDATE todos 
        SET title = COALESCE(?, title), 
            description = COALESCE(?, description), 
            completed = COALESCE(?, completed), 
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = ? AND user_id = ?
      `;

      db.run(sql, [title, description, completed, id, userId], function(err) {
        if (err) {
          console.error("Error updating todo:", err);
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error("Todo not found or not authorized"));
        } else {
          Todo.findById(id).then(resolve).catch(reject);
        }
      });
    });
  }

  static async delete(id, userId) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM todos WHERE id = ? AND user_id = ?';

      db.run(sql, [id, userId], function(err) {
        if (err) {
          console.error("Error deleting todo:", err);
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error("Todo not found or not authorized"));
        } else {
          resolve({ success: true, message: "Todo deleted successfully" });
        }
      });
    });
  }
}