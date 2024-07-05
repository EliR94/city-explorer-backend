const format = require("pg-format");
const db = require("../connection");

const seed = ({ citiesData, userData, bucketListData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS bucket_list;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS cities;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      const citiesTablePromise = db.query(`
      CREATE TABLE cities (
        city_name VARCHAR PRIMARY KEY,
        city_longitude DOUBLE PRECISION NOT NULL,
        city_latitude DOUBLE PRECISION NOT NULL,
        city_radius INT,
        city_rectangle JSONB NOT NULL
      );`);

      const usersTablePromise = db.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        password VARCHAR NOT NULL
      );`);

      return Promise.all([citiesTablePromise, usersTablePromise]);
    })
    .then(() => {
      return db
        .query(
          `
CREATE TABLE bucket_list (
  bucket_list_id SERIAL PRIMARY KEY,
  place_displayname VARCHAR NOT NULL,
  place_json JSONB NOT NULL,
  city_name VARCHAR REFERENCES cities(city_name) NOT NULL,
  username VARCHAR REFERENCES users(username) NOT NULL
)`)
        .catch((err) => console.log(err, 'error here'));
    })
    .then(() => {
      const insertCitiesQueryStr = format(
        "INSERT INTO cities (city_name, city_longitude, city_latitude, city_radius, city_rectangle) VALUES %L RETURNING *",
        citiesData.map(({ city_name, longitude, latitude, radius, rectangle }) => [
          city_name,
          longitude,
          latitude,
          radius,
          rectangle
        ])
      );
      return db.query(insertCitiesQueryStr);
    })
    .then((result) => {
      const citiesData = result.rows;
      const insertUsersQueryStr = format(
        "INSERT INTO users ( username, password) VALUES %L RETURNING *;",
        userData.map(({ username, password }) => [username, password])
      );
      return db.query(insertUsersQueryStr).then((usersResult) => {
        const usersData = usersResult.rows;
        return { citiesData, usersData };
      });
    })
    .then(({ citiesData, usersData }) => {
      const insertBucketListQueryStr = format(
        `INSERT INTO bucket_list (
          place_displayname, 
          place_json,
          city_name,
          username
         ) VALUES %L RETURNING *`,
        bucketListData.map(
          ({ place_displayname,
            place_json,
            city_name,
            username
          }) => [
            place_displayname,
            place_json,
            city_name,
            username
          ]
        )
      );
      return db.query(insertBucketListQueryStr).then((bucketListResult)=>{
        const bucketListData = bucketListResult.rows;
        return { citiesData, usersData, bucketListData};
      })
    })
};

module.exports = seed;
