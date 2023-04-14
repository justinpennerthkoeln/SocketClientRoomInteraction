const {Pool} = require('pg');

var credentials = require('../config/default.json').postgres;

const pool = new Pool(credentials);

async function create(username, password = null) {
    try {
        const query = "INSERT INTO rooms (room_name, password) VALUES ($1, $2) RETURNING *";
        const values = [username, password];
        return await pool.query(query, values);
    } catch (error) {
        throw new Error;
    }
}

async function getRoomByName(room_name) {
    try {
        const query = "SELECT * FROM rooms WHERE room_name = $1";
        const values = [room_name];
        return await pool.query(query, values);
    } catch (error) {
        
    }
}

async function getAll() {
    try {
        const query = "SELECT * FROM rooms";
        const values = [];
        return await pool.query(query, values);
    } catch (error) {
        throw new Error;
    }
}

async function getById(id) {
    try {
        const query = "SELECT * FROM rooms where id=$1";
        const values = [id];
        return await pool.query(query, values);
    } catch (error) {
        throw new Error;
    }
}


module.exports = {create, getAll, getById};