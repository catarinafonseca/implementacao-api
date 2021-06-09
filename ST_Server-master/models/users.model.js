const sql = require("./db.js");

const User = function (user) {
    this.nome = user.nome;
    this.email = user.email;
    this.idTipo = user.idTipo;
    this.password = user.password;
    this.foto = user.foto;
    this.idCurso = user.idCurso;
    this.data_nasc = user.data_nasc;
    this.idNivel = user.idNivel;
    this.pontuacao = user.pontuacao;
    this.blocked = user.blocked
    
};

// METHODS 
User.getAll = (query, result) => {
    const obj = query

    const whitelist = ['nome'];

    // set up an empty array to contain the WHERE conditions
    let where = [];
    let queryStr = `SELECT * FROM utilizador`;

    // Iterate over each key / value in the object
    Object.keys(obj).forEach(function (key) {
        // if the key is not whitelisted, do not use
        if (!whitelist.includes(key)) {
            return;
        }
        // if the value is an empty string, do not use
        if ('' === obj[key]) {
            return;
        }
        // if we've made it this far, add the clause to the array of conditions
        if (key === 'nome') {
            where.push(`\`${key}\` LIKE "%${obj[key]}%"`);
        }

    });
     where.push('idTipo != 3')
    // convert the where array into a string of AND clauses
    where = where.join(' AND ');

    // if there IS a WHERE string, prepend with WHERE keyword
    if (where) {
        where = ` WHERE ${where}`;
        queryStr = queryStr + where
        sql.query(queryStr, (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            result(null, res);
        });
    } else {
        sql.query(queryStr, (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            result(null, res);
        });
    }
};
User.findById = (id, result) => {
    sql.query("SELECT * FROM utilizador WHERE idUtilizador=?", [id], (err, res) => {
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
User.findByEmail = (email, result) => {
    sql.query("SELECT * FROM utilizador WHERE email=?", [email], (err, res) => {

        if (err) {
            result(err, null)
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result({ kind: "not_found" }, null);
        return
    });
};
User.create = (newUser, result) => {
    sql.query("INSERT INTO utilizador SET ?", newUser, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        return (null, res);
    });
};
User.remove = (id, result) => {
    sql.query("DELETE FROM utilizador WHERE idUtilizador=?", [id], (err, res) => {
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
User.updateById = (idUser, user, result) => {
    let query = 'UPDATE utilizador SET ? WHERE ?';

    let q = sql.query(
        query, [user, { idUtilizador: idUser }], (err, res) => {

            if (err) {
                result(err, null);
                return;
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            result(null, res);
        });
};
// EXPORT MODEL (required by CONTROLLER)
module.exports = User;