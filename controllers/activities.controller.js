const Activity = require('../models/activities.model.js');

exports.findAll = (req, res) => {
    Activity.getAll(req.query, (err, data) => {
        if (err)
            if (err.kind === 'not found')
                res.status(404).json({
                    message: `Not found Activities.`
                });
            else
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving Activities."
                });
        else
            res.status(200).json(data);
    });
};
exports.findOne = (req, res) => {
    Activity.findById(req.params.activityID, (err, data) => {
        if (err) {
            if (err.kind === 'not found')
                res.status(404).json({
                    message: `Not found Activity with id ${req.params.activityID}.`
                });
            else
                res.status(500).json({
                    message: `Error retrieving Activity with id ${req.params.activityID}.`
                });
        } else
            res.status(200).json(data);
    });
};
exports.delete = (req, res) => {
    Activity.remove(req.params.activityID, (err, data) => {
        if (err) {
            if (err.kind === 'not found')
                res.status(404).json({
                    message: `Not found Activity with id ${req.params.activityID}.`
                });
            else
                res.status(500).json({
                    message: `Error retrieving Activity with id ${req.params.activityID}.`
                });
        } else
            res.status(200).json({
                message: `Deleted with sucess Activity with id ${req.params.activityID}.`
            });
    });
};
exports.create = (req, res) => {
    let activity = {
        nome: req.body.nome,
        desc_atividade: req.body.desc_atividade,
        num_participantes: req.body.num_participantes,
        imagem: req.body.imagem,
        certificado_SN: req.body.certificado_SN,
        data_hora: req.body.data_hora,
        idLocal: req.body.idLocal,
        idCategoria: req.body.idCategoria,
        concluida: "false"
    };
    if (!req.body || !req.body.nome || !req.body.desc_atividade || !req.body.num_participantes || !req.body.imagem || !req.body.certificado_SN 
        || !req.body.data_hora || !req.body.idLocal || !req.body.idCategoria) {
        res.status(400).json({ message: "Please check if all variables are filled!" });
        return;
    }
    Activity.findById(req.body.nome, (err, data) => {

        Activity.findByName(activity.nome, (err, data) => {
            if (err) {
                if (err.kind === 'not found') {
                    Activity.create(activity, (err, data) => {
                        if (err)
                            res.status(500).json({
                                message: err.message || "Some error occurred while creating the Activity."
                            });
                        else {
                            res.status(201).json({ message: "New activity created.", id: data.insertId, location: "/activities/" + data.insertId });
                        }
                    });
                }
                else
                    res.status(500).json({
                        message: `Some Error Occurred!`
                    });
            } else
                res.status(400).json({ message: "Failed! Activity is already registered!" });
        });

    });
};
exports.update = (req, res) => {
    let activity = {
        nome: req.body.nome,
      /*   desc_atividade: req.body.desc_atividade,
        num_participantes: req.body.num_participantes,
        imagem: req.body.imagem,
        certificado_SN: req.body.certificado_SN,
        data_hora: req.body.data_hora,
        idLocal: req.body.idLocal,
        idCategoria: req.body.idCategoria,
        concluida: "false" */
    };
    // Validate request
    if (!req.body || !activity/* req.body.nome || !req.body.desc_atividade || !req.body.idLocal || req.body.data_hora */) {
        res.status(400).json({ message: "Please check if all variables are filled!" });
        return;
    }

    Activity.updateById(req.params.activityID, activity, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).json({
                    message: `Not found activity with id ${req.params.activityID}.`
                });
            } else {
                res.status(500).json({
                    message: `Error updating activity with id ${req.params.activityID}.`
                });
            }
        } else
            res.status(200).json({ message: "Updated activity.", location: `/activities/${req.params.activityID}` });
    });
};
exports.findAllConcluded = (req, res) => {
    Activity.getAllConcluded((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving activities."
            });
        else {
            res.status(200).json(data);
        }
    });
};