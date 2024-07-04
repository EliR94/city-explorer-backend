const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const placeData = require("../db/data/test-data/place.json");
const endpoints = require("../endpoints.json")

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

describe("GET /api", ()=>{
  test("200 status code: returns json object containing all endpoints", ()=>{
    return request(app)
    .get("/api")
    .expect(200)
    .then(({body})=>{
      expect(body.endpoints).toEqual(endpoints)
    })
  })
})


describe("GET /api/cities", () => {
  test("200 status code: returns array of all cities in alphabetical order", () => {
    return request(app)
      .get("/api/cities")
      .expect(200)
      .then(({ body }) => {
        expect(body.cities.length).toBe(36)
        expect(body.cities).toBeSortedBy('city_name', {descending: false})
        body.cities.forEach((city) => {
          expect(city).toMatchObject({
            city_name: expect.any(String),
            city_latitude: expect.any(Number),
            city_longitude: expect.any(Number),
            city_radius: expect.any(Number),
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
  test('404 status code: No user with that username! if passed a username query that does not exist in the users table', () => {
    return request(app)
    .get("/api/cities?username=smalltraveller")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("No user with that username!")
    })
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
  test("404 status code: No user with that name! when passed a username that does not match any username in database", () => {
    return request(app)
      .get("/api/bucket_list/random")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No user with that username!");
      });
  });
  test('404 status code: No city with that name! if passed a city_name query that does not exist in the city table', () => {
    return request(app)
    .get("/api/bucket_list/bigtraveller?city_name=Landon")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("No city with that name!")
    })
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
  test('400 staus code: Incomplete POST request: one or more required fields missing data', () => {
    return request(app)
    .post("/api/users")
    .send({
      username: "newuser2",
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Incomplete POST request: one or more required fields missing data")
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
  test('400 staus code: Incomplete POST request: one or more required fields missing data', () => {
    return request(app)
    .post("/api/bucket_list")
    .send({
      place_displayname: "Bullring & Grand Central",
      place_json: placeData,
      username: "madexplorer",
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Incomplete POST request: one or more required fields missing data")
    });
  });
  test("404 status code: No user with that name! when passed a username that does not match any username in database", () => {
    return request(app)
      .post("/api/bucket_list")
      .send({
        place_displayname: "Bullring & Grand Central",
        place_json: placeData,
        city_name: "Birmingham",
        username: "notauser",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No user with that username!");
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
  test('404 status code: No bucket list item exists with that id', () => {
    return request(app)
    .delete('/api/bucket_list/999')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Place does not exist")
    })
  });
  test('400 status code: Invalid input: expected a number', () => {
    return request(app)
    .delete('/api/bucket_list/id')
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Invalid input: expected a number")
    })
  });
});
