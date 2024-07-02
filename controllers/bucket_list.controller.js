const { use } = require("../app")
const { fetchBucketList, fetchBucketListByUser, addPlace, deletePlace } = require("../models/bucket_list.model")
const { fetchCityByName } = require("../models/cities.model")
const { fetchUserByUsername } = require("../models/users.model")

exports.getBucketList = (req, res, next) =>{
    fetchBucketList().then((bucketList)=>{
        res.status(200).send({bucketList})
    }).catch((err)=>{next(err)})
}

exports.getBucketListByUser = (req, res, next)=>{
    const { username } = req.params;
    const { city_name } = req.query;
    const promisesArr = [fetchUserByUsername(username), fetchBucketListByUser(username, city_name)]
    if(city_name){
        promisesArr.push(fetchCityByName(city_name))
    }
    Promise.all(promisesArr)
    .then((promises)=>{
        const bucketList = promises[1]
        res.status(200).send({bucketList})
    }).catch((err)=>{next(err)
    })
}

exports.postPlace = (req, res, next) =>{
    const {body} = req
    if(!body.city_name || !body.place_displayname || !body.place_json || !body.username){
        res.status(400).send({msg: "Incomplete POST request: one or more required fields missing data"})
    }
    const promisesArr = [fetchUserByUsername(body.username), addPlace(body)]
    Promise.all(promisesArr).then((promises)=>{
        const addedPlace = promises[1]
        res.status(201).send({addedPlace})
    }).catch((err)=>{
        next(err)
    })
}

exports.removePlace = (req, res, next) => {
    const { bucket_list_id } = req.params
    deletePlace(bucket_list_id).then(()=>{
        res.status(204).end()
    }).catch((err) => {
        next(err)
    })
}