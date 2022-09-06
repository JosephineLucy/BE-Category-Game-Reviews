const db = require("../db/connection");
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

describe("Error Handlers", () => {
  test("GET 404 status with custom error message, when entered an incorrect path", () => {
    return request(app)
      .get("/api/category")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("path does not exist, sorry!");
      });
  });
  test("GET 404 status with custom error message, when entered an id that does not currently exist on database", () => {
    return request(app)
      .get("/api/reviews/500")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("no review found with the input id, sorry!");
      });
  });
  test("GET 400 status, responds with custom error message when passed a bad request", () => {
    return request(app)
      .get("/api/reviews/idfive")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH - status 404 id not found - responds with custom error message", () => {
    return request(app)
      .patch("/api/review/1")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("path does not exist, sorry!");
      });
  });
  test("PATCH - status 404 path not found - responds with custom error message", () => {
    return request(app)
      .patch("/api/reviews/1000")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("no review found with the input id, sorry!");
      });
  });
  test("PATCH - status 400 invalid votes object - responds with custom error message", () => {
    return request(app)
      .patch("/api/reviews/1000")
      .send({ inc_votes: "atrocious" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          "Invalid vote increase, please enter a number to increase votes by"
        );
      });
  });
  test("POST commentsByID - 400 status, when invalid entered id", () => {
    return request(app)
      .post("/api/reviews/numberone/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("POST commentsByID - 400 status, when entered empty body", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("POST commentsByID - 400 status, when entered an invalid body - missing a username", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ body: "I forgot to include a username!" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("POST commentsByID - 400 status, when entered an invalid body - missing a body", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "mallionaire" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("POST commentsByID - 400 status, when entered a valid body but username doesn't exist in db", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "rupi", body: "I am not a user yet" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("sorry, invalid username!");
      });
  });
  test("GET reviews (queries) - 400 status, when entered an invalid sort_by", () => {
    return request(app)
      .get("/api/reviews?sort_by=theVeryBestCategory")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          "sorry, this column does not exist! Please try a different column to sort by."
        );
      });
  });
  test("GET reviews (queries) - 400 status, when entered an invalid order", () => {
    return request(app)
      .get("/api/reviews?order=TOMATOES")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          "sorry, invalid order specified! Valid orders are ASC and DESC."
        );
      });
  });
  test("GET reviews (queries) - 400 status, when entered an invalid category", () => {
    return request(app)
      .get("/api/reviews?category=wingardiumLeviosa")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          "sorry, this category does not exist! Please try a different category to filter by."
        );
      });
  });
  test("GET reviews (queries) - 404 status, when entered a valid category but there are no reviews", () => {
    return request(app)
      .get("/api/reviews?category=children's%20games")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("sorry, no reviews found for this category");
      });
  });
  test("DELETE commentsByID - 400 status, when invalid entered id", () => {
    return request(app)
      .delete("/api/comments/numberone")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("DELETE commentsByID - 404 status, when valid entered id but out of range", () => {
    return request(app)
      .delete("/api/comments/600")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("sorry, no comment found for this comment_id!");
      });
  });
});

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
  test("200: nested review object contains the key of comment_count:", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("200: nested review object contains the correct comment_count value:", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            comment_count: 3,
          })
        );
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("202 status", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 1 })
      .expect(202);
  });
  test("202: returns an updated review object:", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 1 })
      .expect(202)
      .then(({ body: { updated_review } }) => {
        expect(updated_review).toEqual({
          review_id: 1,
          title: "Agricola",
          category: "euro game",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_body: "Farmyard fun!",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 2,
        });
      });
  });
});

describe("GET /api/users", () => {
  test("200 response", () => {
    return request(app).get("/api/users").expect(200);
  });
  test("200 response, returns an array of objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBeGreaterThan(0);
        users.forEach((user) => {
          expect(typeof user).toBe("object");
        });
      });
  });
  test("200 response, returns an object containing array of objects which should have the properties username, name, avatar_url ", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews", () => {
  test("200 response, returns an object containing array of objects which should have the correct properties ", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews.length).toBeGreaterThan(0);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              category: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_body: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("objects are sorted into descending order by date", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: returns an array of objects containing correct properties", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBeGreaterThan(0);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: returns an array of objects containing matching review id with id , when review id has comments", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBeGreaterThan(0);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              review_id: 2,
            })
          );
        });
      });
  });
  test("200: returns an empty when no comments exist for passed id", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ comments: [] });
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("201: responds with posted comment", () => {
    const commentToPost = {
      username: "mallionaire",
      body: "Terrific!",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(commentToPost)
      .expect(201)
      .then(({ body: { postedComment } }) => {
        expect(postedComment).toEqual(
          expect.objectContaining({
            review_id: 1,
            author: "mallionaire",
            body: "Terrific!",
          })
        );
      });
  });
});

describe("GET /api/reviews (queries)", () => {
  test("sort_by sorts reviews by colmumn specified in query", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("votes", { descending: true });
      });
  });
  test("sort_by sorts reviews by column specified in query", () => {
    return request(app)
      .get("/api/reviews?sort_by=title")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("title", { descending: true });
      });
  });
  test("order specified in query determines whether order is ascending or descending", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("reviews are filtered by category specified in query", () => {
    return request(app)
      .get("/api/reviews?category=social deduction")
      .expect(200)
      .then(({ body: { reviews } }) => {
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              category: "social deduction",
            })
          );
        });
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204 status", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("204 status: response body is empty", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
});

describe("GET /api", () => {
  test("status 200, responds with json", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            endpoints: expect.any(Object),
          })
        );
      });
  });
});
