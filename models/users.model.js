const db = require('../db/connection')
const fs = require('fs/promises')
const format = require("pg-format");

exports.fetchUsers = ()=>{
    return db.query("SELECT * FROM users")
    .then(({rows})=>{
        if(rows.length ===0){
            return Promise.reject({status: 404, msg: "No users found!"})
        }
        return rows
    })
}

exports.fetchUserByUsername = (username) => {
    return db
      .query(
        "SELECT * FROM users WHERE users.username = $1",
        [username]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "No user with that username!" });
        }
        return rows[0];
      });
  };
  
  exports.addUser = (user)=>{
    const valuesArr = [[user.username, user.password]]
    const formattedQuery = format("INSERT INTO users (username, password) VALUES %L RETURNING *", valuesArr)
    return db.query(formattedQuery).then(({rows})=>{
      return rows[0]
    })
    .catch((err)=>{
    throw err
    })
  }