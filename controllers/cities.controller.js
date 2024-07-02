const {fetchCities, fetchCityByName, fetchCitiesByUsername} = require("../models/cities.model");
const { fetchUserByUsername } = require("../models/users.model");

exports.getCities = (req, res, next) =>{
    const {username} = req.query;
    if(username){
       fetchUserByUsername(username)
       .then(()=>{return fetchCities(username)})
       .then((cities)=>{
        res.status(200).send({cities})
    }).catch((err)=>{next(err)})
    } else {
        fetchCities()
        .then((cities)=>{
            res.status(200).send({cities})
        }).catch((err)=>{next(err)})
    }
}

exports.getCityByName = (req, res, next)=>{
    const { city_name } = req.params;
    fetchCityByName(city_name)
    .then((city)=>{
        res.status(200).send({city})
    })
    .catch((err)=>{
        next(err)
    })
}
