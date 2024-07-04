const db = require('../db/connection')
const fs = require('fs/promises')

exports.fetchCities = (username)=>{
  let queryStr = "SELECT cities.city_name, cities.city_longitude, cities.city_latitude, cities.city_radius FROM cities"
  const queryArr = []
  if(username){
    queryStr += ' RIGHT JOIN bucket_list ON cities.city_name = bucket_list.city_name WHERE bucket_list.username = $1 GROUP BY cities.city_name'
    queryArr.push(username)
  }
  queryStr += ' ORDER BY cities.city_name ASC'
    return db.query(queryStr, queryArr)
    .then(({rows})=>{
        if(rows.length ===0){
            return Promise.reject({status: 404, msg: "No cities found!"})
        }
        return rows
    })
}

exports.fetchCityByName = (city_name) => {
    return db
      .query(
        "SELECT * FROM cities WHERE cities.city_name = $1",
        [city_name]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "No city with that name!" });
        }
        return rows[0];
      });
  };
