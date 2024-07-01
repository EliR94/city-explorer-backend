const {fetchCities, fetchCityByName, fetchCitiesByUsername} = require("../models/cities.model")

exports.getCities = (req, res, next) =>{
    const {username} = req.query;
    fetchCities(username).then((cities)=>{
        res.status(200).send({cities})
    }).catch((err)=>{next(err)})
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
