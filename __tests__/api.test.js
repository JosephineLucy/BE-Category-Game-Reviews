const db = require("../db/connection");
// ref object = const ____ = require('../utilities');
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data");
const app = require("../app");
const seed = require("../db/seeds/seed");
const request = require("supertest");

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));

afterAll(() => db.end());

describe("GET /api/categories", () => {
  test("200 response", () => {
    return request(app).get("/api/categories").expect(200);
  });
  test("200 response, returns an array of objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories.length).toBeGreaterThan(0);
        categories.forEach((category) => {
          expect(typeof category).toBe("object");
        });
      });
  });
  test("200 response, returns an object containing array of objects which should have the properties slug and description ", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("200 response", () => {
    return request(app).get("/api/reviews/1").expect(200);
  });
  test("200: returns a nested review object:", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(Object.keys(review).length).toBeGreaterThan(0);
      });
  });
  test("200: nested review object has the correct keys and values:", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            review_id: 1,
            title: "Agricola",
            category: "euro game",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_body: "Farmyard fun!",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            created_at: "2021-01-18T10:00:20.514Z",
            votes: 1,
          })
        );
      });
  });
});

describe.only("Error Handlers", () => {
  test("404 status with custom error message, when entered an incorrect path", () => {
    return request(app)
      .get("/api/category")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("path does not exist, sorry!");
      });
  });
  test("404 status with custom error message, when entered an id that does not currently exist on database", () => {
    return request(app)
      .get("/api/reviews/500")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("no review found with the input id, sorry!");
      });
  });
  test('400 status, responds with custom error message when passed a bad request', () => {
    return request(app)
      .get('/api/reviews/idfive')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
    });
});
