const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    password: '03122604',
    database: 'cobranca',
    host: 'localhost',
    port: '5432'
})

module.exports = pool;