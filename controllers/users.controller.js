const {fetchUsers, fetchUserByUsername, addUser} = require("../models/users.model")

exports.getUsers = (req, res, next) =>{
    fetchUsers().then((users)=>{
        res.status(200).send({users})
    }).catch((err)=>{next(err)})
}

exports.getUserByUsername = (req, res, next)=>{
    const { username } = req.params;
    fetchUserByUsername(username)
    .then((user)=>{
        res.status(200).send({user})

    })
    .catch((err)=>{
        next(err)
    })
}

exports.postUser = (req,res, next)=>{
    const {body} = req
    const username = body.username
    if (!username || !body.password){
        res.status(400).send({msg: "Incomplete POST request: one or more required fields missing data"
        })
    }
    else{
        addUser(body).then((addedUser)=>{
            res.status(201).send({addedUser})
        }).catch((err)=>{
            console.error("error in postUser", err)
            next(err)
        })
    }
}