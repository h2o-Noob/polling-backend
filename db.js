
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',  // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'polling_system',  // Name of the database you created earlier
  password: 'Arindam@7743',   // Your PostgreSQL password
  port: 5433,                  // Default PostgreSQL port
});

pool.connect().then(() => {
    console.log("Connection done")
})

module.exports = pool;
