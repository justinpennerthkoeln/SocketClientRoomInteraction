const {Pool} = require('pg');

var credentials = require('../config/default.json').postgres;

const pool = new Pool(credentials);

async function create(username, password) {
    try {
        const query = "INSERT INTO users (username, password) VALUES ($1, $2)";
        const values = [username, password];
        return await pool.query(query, values);
    } catch (error) {
        throw new Error;
    }
}

async function getUserByNameAndPassword(username, password) {
    try {
        const query = "SELECT * FROM users WHERE username = $1 AND password = $2";
        const values = [username, password];
        return await pool.query(query, values);
    } catch (error) {
        throw new Error;
    }
}


module.exports = {create, getUserByNameAndPassword};