import { sqlite3 } from 'sqlite3';
import { createTables } from './schema.js'

let db = null;

export const iniliatizeDb = async () => {
    return new Promise ((resolve , reject) => {
        dp = new sqlite3.Databse('./todo.db' , (err) => {
            if (err) {
                console.log('error starting the Database' , err);
                reject(err);    
            }else {
                console.log('Database started and connected');

                createTables(db)// yeh db ko apne aap baarne ke liye 
                    .then (() => {
                        console.log('Tables has been created');
                        resolve(db);
                    })
                    .catch(reject);
            }
        });
    });
};

export const getDatabase = () => {
    if(!db) {
        console.log('database is not initiated , call iniliatizeDb() first');
    }
    return db;
}