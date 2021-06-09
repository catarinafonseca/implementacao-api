const Submission = require('../models/submissions.model.js');

exports.findAll = (req, res) => {
    Submission.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Submissions."
            });
        else
            res.status(200).json(data);
    });
};
exports.findAllByLoggedUser = (req, res) => {
    Submission.getAllByLoggedUser((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Submissions."
            });
        else
            res.status(200).json(data);
    });
};
exports.findAllActivities = (req, res) => {
    Submission.getAllActivities((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Submissions."
            });
        else
            res.status(200).json(data);
    });
};
exports.findAllQuizzes = (req, res) => {
    Submission.getAllQuizzes((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Submissions."
            });
        else
            res.status(200).json(data);
    });
};
exports.findOne = (req, res) => {
    Submission.findById(req.params.submissionID, (err, data) => {
        if (err) {
            if (err.kind === 'not found')
                res.status(404).json({
                    message: `Not found Submission with id ${req.params.submissionID}.`
                });
            else
                res.status(500).json({
                    message: `Error retrieving Submission with id ${req.params.submissionID}.`
                });
        } else
            res.status(200).json(data);
    });
};
exports.createActivity = (req, res) => {
    // Validate request
    if (!req.body || !req.body.idUtilizador || !req.body.idAtividade ) {
        res.status(400).json({ message: "Please check if all variables are filled!" });
        return;
    }

    const submission = {
        idUtilizador: req.body.idUtilizador,
        idAtividade: req.body.idAtividade,
        
    };
    Submission.findBySubmission(submission.idUtilizador, submission.idAtividade, (err,data)=>{
        if(err){
            Submission.create(submission, (err, data) => {
                if (err)
                    res.status(500).json({
                        message: err.message || "Some error occurred while creating this submission."
                    });
                else {
                    res.status(201).json({ message: "New submission created.", location: "/submissions/" + data.insertId });
                }
            });
        }else{
            res.status(400).json({
                message: "Submission already created."
            });
        }
    })
};
exports.createQuiz = (req, res) => {
    const submission = {
        
        idUtilizador: req.body.idUtilizador,
        idQuiz: req.body.idQuiz,
       
    };
    // Validate request
    if (!req.body || !req.body.idUtilizador || !req.body.idQuiz) {
        res.status(400).json({ message: "Please check if all variables are filled!" });
        return;
    }

    Submission.create(submission, (err, data) => {
        if (err)
            res.status(500).json({
                message: err.message || "Some error occurred while creating this submission."
            });
        else {
            res.status(201).json({ message: "New submission created.", location: "/submissions/" + data.insertId });
        }
    });
};
exports.delete = (req, res) => {
    Submission.remove(req.params.submissionID, (err, data) => {
        if (err) {
            if (err.kind === 'not found')
                res.status(404).json({
                    message: `Not found submission with id ${req.params.submissionID}.`
                });
            else
                res.status(500).json({
                    message: `Error retrieving submission with id ${req.params.submissionID}.`
                });
        } else
            res.status(200).json({
                message: `Deleted with sucess submission with id ${req.params.submissionID}.`
            });
    });
};