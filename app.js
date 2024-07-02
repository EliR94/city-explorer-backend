const express = require('express')
const cors = require('cors');
const { getCities, getCityByName, getCitiesByUser } = require('./controllers/cities.controller');
const { getUsers, getUserByUsername, postUser } = require('./controllers/users.controller');
const { getBucketList, getBucketListByUser, postPlace, removePlace } = require('./controllers/bucket_list.controller');
const { getEndpoints } = require('./controllers/endpoints.controller');
const app = express()
app.use(cors());
app.use(express.json())

app.get('/api', getEndpoints)

app.get('/api/cities', getCities)

app.get('/api/users', getUsers)

app.get('/api/bucket_list', getBucketList)

app.get('/api/users/:username', getUserByUsername)

app.get('/api/cities/:city_name', getCityByName)

app.get('/api/bucket_list/:username', getBucketListByUser)

//add on queries to filter by city // other things??

app.post('/api/users', postUser)

app.post('/api/bucket_list', postPlace)

app.delete('/api/bucket_list/:bucket_list_id', removePlace)

app.all("*", (req,res)=>{
    res.status(404).send({msg: "Route not found"})
})

app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg: "Invalid input: expected a number"})
    } else {
        next(err)
    }
})

app.use((err, req, res, next)=>{
    res.status(500).send({msg: 'internal server error'})
})

  module.exports = app
  
