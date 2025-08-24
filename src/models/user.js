import { getDatabase } from "../database/connect";
import { hashPassword , comparePass } from "../utils/bcrypt";

export class User {

    //creating of user
    static async createUser ( username , email , password){
        const db = getDatabase();

        const hashPass = await hashPassword(password);


        return new Promise((resolve , reject) => {
            const sql = 'INSERT INTO users (username , email , password) values(? , ? , ?)';
            
            db.run(sql , [username , email , password] , function(err){
                if(err){
                    reject(err);
                }{
                    resolve({id : this.lastId , username , password});
                }
            })
        });
    };

    //finding by id 
    static async findById (id) {
        const db = getDatabase();

        return new Promise ((resolve , reject) => {
            const sql = 'SELECT id , username , email ,  created_at FROM users WHERE id = ? ';
            db.get(sql , [id] , function(err) {
                if(err){
                    reject(err);
                }else{
                    resolve(row);
                }
            });
        });
    };

    //finding by email
    static async findByEmail (email) {
        const db = getDatabase();

        return new Promise ((resolve , reject) => {
            const sql = 'SELECT * FROM users WHERE email = ? ';

            db.get(sq , [email] , function(err){
                if(err){
                    reject(err);
                }
                else{
                    resolve(err);
                } 
            });
        });
    };


    //authenticator check
    static async authenticate(email , password){
        const user_check = await this.findByEmail(email);
        if(!user_check) return null;
        
        const isVaildPass = await comparePass(password , user_check.password);
        if(!isVaildPass) return null;

        const {password: _ , ...userWithoutPassword} = user_check;
        return userWithoutPassword;
    }

}

