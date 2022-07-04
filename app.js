const express = require('express');
const app = express();
const getCategories = require('./Controllers/categoriesControllers')

app.use(express.json())

app.get('/api/categories', getCategories)
// app.post

app.use('*', (req, res)=>{
    res.status(404).send('path does not exist, sorry!')
})

app.use((err, req, res, next)=>{
    res.status(500).send({error_message : 'Error something went wrong, sorry!!' })
})
module.exports = app;
