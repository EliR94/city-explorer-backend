const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const placeData = require("../db/data/test-data/place.json");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => db.end());

describe("Invalid paths", () => {
  test("status 404: returns 'Route not found' when path contains invalid path", () => {
    return request(app)
      .get("/api/invalid_path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api/cities", () => {
  test("200 status code: returns array of all cities", () => {
    return request(app)
      .get("/api/cities")
      .expect(200)
      .then(({ body }) => {
        expect(body.cities.length).toBe(3);
        body.cities.forEach((city) => {
          expect(city).toMatchObject({
            city_name: expect.any(String),
            city_latitude: expect.any(Number),
            city_longitude: expect.any(Number),
          });
        });
      });
  });
  test("200 status code: returns array of all cities the user has in their bucket_list", () => {
    return request(app)
      .get("/api/cities?username=madexplorer")
      .expect(200)
      .then(({ body }) => {
        expect(body.cities.length).toBe(1);
        body.cities.forEach((city) => {
          expect(city).toMatchObject({
            city_name: "London",
            city_latitude: 51.5072,
            city_longitude: -0.1275,
          });
        });
      });
  });
  test("200 status code: returns array of all cities the user has in their bucket_list", () => {
    return request(app)
      .get("/api/cities?username=bigtraveller")
      .expect(200)
      .then(({ body }) => {
        expect(body.cities.length).toBe(2);
        body.cities.forEach((city) => {
          expect(city).toMatchObject({
            city_name: expect.any(String),
            city_latitude: expect.any(Number),
            city_longitude: expect.any(Number),
          });
        });
      });
  });
});

describe("GET /api/users", () => {
  test("200 status code: returns array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(3);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            password: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/bucket_list", () => {
  test("200 status code: returns array of all bucket_list items", () => {
    return request(app)
      .get("/api/bucket_list")
      .expect(200)
      .then(({ body }) => {
        expect(body.bucketList.length).toBe(4);
        body.bucketList.forEach((place) => {
          expect(place).toMatchObject({
            bucket_list_id: expect.any(Number),
            place_displayname: expect.any(String),
            place_json: expect.any(Object),
            city_name: expect.any(String),
            username: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200 status code: responds with a user object corresponding to username provided", () => {
    return request(app)
      .get("/api/users/madexplorer")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject({
          username: "madexplorer",
          password: "myPassword",
        });
      });
  });
  test("404 status code: No user with that username! when passed a username that does not match any user in database", () => {
    return request(app)
      .get("/api/users/random")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No user with that username!");
      });
  });
});

describe("GET /api/cities/city", () => {
  test("200 status code: responds with a city object corresponding to city name provided", () => {
    return request(app)
      .get("/api/cities/London")
      .expect(200)
      .then(({ body }) => {
        expect(body.city).toMatchObject({
          city_name: "London",
          city_latitude: 51.5072,
          city_longitude: -0.1275,
        });
      });
  });
  test("404 status code: No city with that name! when passed a city name that does not match any city in database", () => {
    return request(app)
      .get("/api/cities/random")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No city with that name!");
      });
  });
});

describe("GET /api/bucket_list/:username", () => {
  test("200 status code: responds with an array of bucket_list places corresponding to the username provided", () => {
    return request(app)
      .get("/api/bucket_list/madexplorer")
      .expect(200)
      .then(({ body }) => {
        expect(body.bucketList.length).toBe(2);
        body.bucketList.forEach((place) => {
          expect(place).toMatchObject({
            bucket_list_id: expect.any(Number),
            place_displayname: expect.any(String),
            place_json: expect.any(Object),
            city_name: expect.any(String),
            username: expect.any(String),
          });
        });
      });
  });
  test("200 status code: responds with empty array if passed a username with no bucketlist items", () => {
    return request(app)
      .get("/api/bucket_list/nolist")
      .expect(200)
      .then(({ body }) => {
        expect(body.bucketList.length).toBe(0);
      });
  });
  test('200 status code: responds with an array of bucket_list places corresponding to the username provided, for the city provided', () => {
    return request(app)
    .get("/api/bucket_list/bigtraveller?city_name=London")
    .expect(200)
    .then(({ body }) => {
      expect(body.bucketList.length).toBe(1);
      body.bucketList.forEach((place) => {
        expect(place).toMatchObject({
          bucket_list_id: expect.any(Number),
          place_displayname: "McDonald\'s",
          place_json: expect.any(Object),
          city_name: "London",
          username: "bigtraveller",
        });
      });
    });
  });
});

describe("POST /api/users", () => {
  test("201 status code: responds with the posted user", () => {
    return request(app)
      .post("/api/users")
      .send({
        username: "newuser2",
        password: "passypassword",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.addedUser).toMatchObject({
          username: "newuser2",
          password: "passypassword",
        });
      });
  });
});

describe("POST /api/bucket_list", () => {
  test("201 status code: responds with the posted bucket_list item", () => {
    return request(app)
      .post("/api/bucket_list")
      .send({
        place_displayname: "Bullring & Grand Central",
        place_json: placeData,
        city_name: "Birmingham",
        username: "madexplorer",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.addedPlace).toMatchObject({
            bucket_list_id: expect.any(Number),
            place_displayname: "Bullring & Grand Central",
            place_json: placeData,
            city_name: "Birmingham",
            username: "madexplorer",
        });
      });
  });
});

describe("DELETE /api/bucket_list/:bucket_list_id", () => {
  test('204 status code: no response, deletes place from bucket list', () => {
    return request(app)
    .delete('/api/bucket_list/1')
    .expect(204)
    .then((response) => {
      expect(Object.keys(response)).not.toInclude("body")
    })
  });
});


// filter by type and accessibity

//error handling:
//posting place by user not in user list
//posting a place that doesnt have a user or city or long/lat

// make endpoints.json
