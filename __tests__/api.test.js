const db = require('../db/connection');
// ref object = const ____ = require('../utilities');
const { categoryData, commentData, reviewData, userData } = require('../db/data/test-data');
const app = require('../app');
const seed = require('../db/seeds/seed');
const request = require('supertest');


beforeEach(()=> seed({ categoryData, commentData, reviewData, userData }))

afterAll(()=> db.end());

describe('GET /api/categories', () =>{
    test('200 response', ()=>{
        return request(app).get('/api/categories').expect(200);
    })
    test('200 response, returns an array of objects', ()=>{
        return request(app).get('/api/categories').expect(200).then(({_body: {categories}})=>{
               categories.forEach((category)=>{ 
                console.log(category, '<<<category')
                expect(typeof category).toBe('object')})
    });
    })
    test('200 response, returns an object containing array of objects which should have the properties slug and description ', ()=>{
        return request(app).get('/api/categories').expect(200).then(({_body: { categories }})=>{
            console.log(categories, '<<<<_body line 21 test')
            categories.forEach((category)=>{ expect(category).toEqual(expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
               })
        )})
    });
    })
})

describe('Error Handlers', ()=>{
    test('404 status with custom error message, when entered an incorrect path', ()=>{
        request(app).get('/api/category').expect(404).then(({ text })=>{
            expect(text).toBe('path does not exist, sorry!')
        });
    })
})