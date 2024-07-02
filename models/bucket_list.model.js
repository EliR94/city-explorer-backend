const db = require('../db/connection')
const fs = require('fs/promises')
const format = require("pg-format");

exports.fetchBucketList = ()=>{
    return db.query("SELECT * FROM bucket_list")
    .then(({rows})=>{
        if(rows.length ===0){
            return Promise.reject({status: 404, msg: "No places found!"})
        }
        return rows
    })
}

exports.fetchBucketListByUser =(username, city_name)=>{
    let queryStr = "SELECT * FROM bucket_list WHERE username = $1"
    const queryArr = [username]
    if(city_name){
        queryStr += " AND city_name = $2"
        queryArr.push(city_name)
    }
    return db.query(queryStr, queryArr)
    .then((result)=>{
        return result.rows
    })
}

exports.addPlace = (place)=>{
    const valuesArr = [[place.place_json, place.place_displayname, place.city_name,
        place.username]]
    const formattedQuery = format("INSERT INTO bucket_list (place_json, place_displayname, city_name,  username) VALUES %L RETURNING *", valuesArr)
    return db.query(formattedQuery).then(({rows})=>{
      return rows[0]
    })
    .catch((err)=>{
    throw err
    })
  }

  exports.deletePlace = (bucket_list_id) => {
    return db.query("DELETE FROM bucket_list WHERE bucket_list_id = $1 RETURNING *", [bucket_list_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Place does not exist"})
        }
    })
  }