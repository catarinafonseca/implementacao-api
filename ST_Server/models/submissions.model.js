const sql = require("./db.js");

const Submission = function (submission) {
    this.data_hora = submission.data_hora;
    this.idUtilizador = submission.idUtilizador;
    this.idAtividade = submission.idAtividade;
};

// METHODS
Submission.getAll = (result) => {
    sql.query("SELECT * FROM historico", (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};
Submission.getAllByLoggedUser = (id,result) => {
    sql.query("SELECT * FROM historico WHERE idUtilizador=?", [id],(err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};
Submission.findById = (id, result) => {
    sql.query("SELECT * FROM historico WHERE idHistorico=?", [id], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return
        }
        result({ kind: 'not found' }, null);
    });
};
Submission.findBySubmission = (idUtilizador, idAtividade, result) => {
    sql.query("SELECT * FROM historico WHERE idUtilizador=? AND idAtividade=?", [idUtilizador, idAtividade], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return
        }
        result({ kind: 'not found' }, null);
    });
};
Submission.getAllActivities = result => {
    sql.query("SELECT * FROM historico WHERE idQuiz IS NULL", (err, res) => {

        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
        console.log(result);
    });
}
Submission.getAllQuizzes = result => {
    sql.query("SELECT * FROM historico WHERE idAtividade IS NULL", (err, res) => {

        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
        console.log(result);
    });
}
Submission.create = (newSubmission, result) => {
    sql.query("INSERT INTO historico SET ?", newSubmission, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};
Submission.remove = (id, result) => {
    sql.query("DELETE FROM historico WHERE idHistorico=?", [id], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.affectedRows) {
            result(null, res[0]);
            return
        }
        result({ kind: 'not found' }, null);
    });
};

// EXPORT MODEL (required by CONTROLLER)
module.exports = Submission;