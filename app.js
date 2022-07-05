const express = require('express');
const app = express();
const { getCategories, getReviews, patchReviews } = require('./Controllers/categoriesControllers')

app.use(express.json())


app.get('/api/categories', getCategories)
app.get('/api/reviews/:review_id', getReviews);
app.patch('/api/reviews/:review_id', patchReviews);

app.use('*', (req, res)=>{
    res.status(404).send({msg: 'path does not exist, sorry!'})
})

app.use((err, req, res, next)=>{
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    }
    next(err);
})

app.use((err, req, res, next)=>{
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad Request' })
    } else res.status(500).send({error_message : 'Error something went wrong, sorry!!' })
})

module.exports = app;
