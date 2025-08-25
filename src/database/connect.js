import sqlite3 from 'sqlite3';
import { createTables } from './schema.js';

let db = null;

export const initializeDb = async () => {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database('./todo.db', (err) => {
            if (err) {
                console.log('Error starting the Database:', err);
                reject(err);
            } else {
                console.log('Database started and connected');

                createTables(db) // db pass correctly
                    .then(() => {
                        console.log('Tables have been created');
                        resolve(db);
                    })
                    .catch(reject);
            }
        });
    });
};

export const getDatabase = () => {
    if (!db) {
        console.log('Database is not initialized, call initializeDb() first');
    }
    return db;
};
