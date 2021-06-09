const User = require('../models/users.model.js');
const bcrypt = require("bcryptjs");

exports.findAll = (req, res) => {
    User.getAll(req.query, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Users."
            });
        else
            res.status(200).json(data);
    });
};
exports.findOne = (req, res) => {
    User.findById(req.params.userID, (err, data) => {
        if (err) {
            if (err.kind === 'not found')
                res.status(404).json({
                    message: `Not found User with id ${req.params.userID}.`
                });
            else
                res.status(500).json({
                    message: `Error retrieving User with id ${req.params.userID}.`
                });
        } else
            res.status(200).json(data);
    });
};
exports.delete = (req, res) => {
    User.remove(req.params.userID, (err, data) => {
        if (err) {
            if (err.kind === 'not found')
                res.status(404).json({
                    message: `Not found user with id ${req.params.userID}.`
                });
            else
                res.status(500).json({
                    message: `Error retrieving user with id ${req.params.userID}.`
                });
        } else
            res.status(200).json({
                message: `Deleted with sucess user with id ${req.params.userID}.`
            });
    });
};
exports.update = (req, res) => {


    req.body.password = bcrypt.hashSync(req.body.password);
    let user = {   
        foto: req.body.foto,
        password: req.body.password 
    
    };

    User.updateById(req.params.userID, user, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).json({
                    message: `Not found user with id ${req.params.userID}.`
                });
            } else {
                res.status(500).json({
                    message: `Error updating user with id ${req.params.userID}.`
                });
            }
        } else
            
            res.status(200).json({ message: "Updated user.", location: `/users/${req.params.userID}` });
    });

  
};
exports.blockOrPromote = (req, res) => {
    const user = {
        blocked: req.body.blocked,
        idTipo: req.body.idTipo
    };

    User.updateById(req.params.userID, user, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).json({
                    message: `Not found user with id ${req.params.userID}.`
                });
            } else {
                res.status(500).json({
                    message: `Error updating user with id ${req.params.userID}.`
                });
            }
        } else
            res.status(200).json({ message: "Updated user.", location: `/users/${req.params.userID}` });
    });
};
