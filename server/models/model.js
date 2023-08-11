const mysql = require("mysql2");
const db = require("../config/config");
// const { pool1 } = require("./dbconfig");
const { host, user, password, database } = db;
var mysqlconnect = mysql.createConnection({ host, user, password, database });

// mysqlconnect.connect((err) => {
//   if (err) {
//     console.log(
//       "Error in connecting to the database...." +
//         JSON.stringify(err, undefined, 2)
//     );
//   } else {
//     console.log("Connected to the database successfully....");
//   }
// });

// module.exports = mysqlconnect;

const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  connectionLimit: 10,
});

function executeQuery(query, values) {
  return new Promise((resolve, reject) => {
    pool.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = { executeQuery };
