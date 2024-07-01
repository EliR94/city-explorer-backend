const { fetchBucketList, fetchBucketListByUser, addPlace, deletePlace } = require("../models/bucket_list.model")

exports.getBucketList = (req, res, next) =>{
    fetchBucketList().then((bucketList)=>{
        res.status(200).send({bucketList})
    }).catch((err)=>{next(err)})
}

exports.getBucketListByUser = (req, res, next)=>{
    const { username } = req.params;
    const { city_name } = req.query;
    fetchBucketListByUser(username, city_name).then((bucketList)=>{
        res.status(200).send({bucketList})
    }).catch((err)=>{next(err)
    })
}

exports.postPlace = (req, res, next) =>{
    const {body} = req
    addPlace(body).then((addedPlace)=>{
        res.status(201).send({addedPlace})
    }).catch((err)=>{
        console.error("error in postBucketList", err)
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