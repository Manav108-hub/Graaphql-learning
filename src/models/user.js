import { getDatabase } from "../database/connect.js";
import { hashPassword, comparePass } from "../utils/bcrypt.js";

export class User {
    // create user
    static async createUser(username, email, password) {
        console.log("Creating user with:", { username, email }); // Debug log
        
        const db = getDatabase();
        const hashPass = await hashPassword(password);

        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.run(sql, [username, email, hashPass], function(err) {
                if (err) {
                    console.error("Database error in createUser:", {
                        error: err,
                        code: err.code,
                        message: err.message,
                        errno: err.errno
                    });
                    reject(err);
                } else {
                    const newUser = { 
                        id: this.lastID, 
                        username, 
                        email,
                        created_at: new Date().toISOString()
                    };
                    console.log("User created successfully:", newUser);
                    resolve(newUser);
                }
            });
        });
    }

    // find by id 
    static async findById(id) {
        const db = getDatabase();
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
            db.get(sql, [id], function(err, row) {
                if (err) {
                    console.error("Database error in findById:", err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // find by email
    static async findByEmail(email) {
        const db = getDatabase();
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE email = ?';
            db.get(sql, [email], function(err, row) {
                if (err) {
                    console.error("Database error in findByEmail:", err);
                    reject(err);
                } else {
                    console.log("User found by email:", row ? "Yes" : "No");
                    resolve(row);
                }
            });
        });
    }

    // authenticator check
    static async authenticate(email, password) {
        try {
            console.log("Authenticating user with email:", email);
            const user = await this.findByEmail(email);
            if (!user) {
                console.log("User not found");
                return null;
            }

            const isValidPass = await comparePass(password, user.password);
            if (!isValidPass) {
                console.log("Invalid password");
                return null;
            }

            // remove password before returning
            const { password: _, ...userWithoutPassword } = user;
            console.log("Authentication successful");
            return userWithoutPassword;
        } catch (error) {
            console.error("Authentication error:", error);
            throw error;
        }
    }
}