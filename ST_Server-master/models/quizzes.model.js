const sql = require("./db.js"); 

const Quiz = function (quiz) {
    this.tema = quiz.tema;
    this.desc_quiz = quiz.desc_quiz;
    this.pergunta = quiz.pergunta;
    this.resposta1 = quiz.resposta1;
    this.resposta2 = quiz.resposta2;
    this.resposta3 = quiz.resposta3;
    this.resposta4 = quiz.resposta4;
    this.resposta_certa = quiz.resposta_certa;
    this.imagem = quiz.imagem
};

// METHODS 
Quiz.getAll = (result) => {
    sql.query("SELECT * FROM quiz", (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};
Quiz.findById = (id, result) => {
    sql.query("SELECT * FROM quiz WHERE idQuiz=?", [id], (err, res) => {
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
Quiz.findByName = (tema, result) => {
    sql.query("SELECT * FROM quiz WHERE tema=?", [tema], (err, res) => {
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
Quiz.create = (newQuiz, result) => {
    sql.query("INSERT INTO quiz SET ?", newQuiz, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
}; 
Quiz.remove = (id, result) => {
    sql.query("DELETE FROM quiz WHERE idQuiz=?", [id], (err, res) => {
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
module.exports = Quiz;