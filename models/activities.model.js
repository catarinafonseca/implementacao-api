const sql = require("./db.js");

const Activity = function (activity) {
    this.nome = activity.nome;
    this.desc_atividade = activity.desc_atividade;
    this.num_participantes = activity.num_participantes;
    this.imagem = activity.imagem;
    this.certificado_SN = activity.certificado_SN;
    this.data_hora = activity.data_hora;
    this.idLocal = activity.idLocal;
    this.idCategoria = activity.idCategoria;
    this.concluida = activity.concluida;
};

// METHODS
Activity.getAll = (query, result) => {
    const obj = query
    const whitelist = ['nome', 'local', 'categoria'];

    // set up an empty array to contain the WHERE conditions
    let where = [];
    let queryStr = `SELECT * FROM atividade`;

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

        if (key === 'local') {
            where.push(` atividade.idLocal = local.idLocal AND local.desc_local = "${obj[key]}"`);
            queryStr = queryStr + ',local'
        }
        if (key === 'categoria') {
            where.push(` atividade.idCategoria = categoria.idCategoria AND categoria.desc_categoria LIKE "%${obj[key]}%"`);
            queryStr = queryStr + ',categoria'
        }
        if (key === 'nome') {
            where.push(`\`${key}\` LIKE "%${obj[key]}%"`);
        }
    });
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
Activity.create = (newActivity, result) => {
    sql.query("INSERT INTO atividade SET ?", newActivity, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};
Activity.findById = (id, result) => {
    sql.query("SELECT * FROM atividade WHERE idAtividade=?", [id], (err, res) => {
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
Activity.findByName = (nome, result) => {
    sql.query("SELECT * FROM atividade WHERE nome=?", [nome], (err, res) => {
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
Activity.remove = (id, result) => {
    sql.query("DELETE FROM atividade WHERE idAtividade=?", [id], (err, res) => {
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
Activity.updateById = (idActivity, activity, result) => {
    let query = 'UPDATE atividade SET ? WHERE ?';

    let q = sql.query(
        query, [activity, { idAtividade: idActivity }], (err, res) => {

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
Activity.getAllConcluded = result => {
    sql.query("SELECT * FROM atividade WHERE concluida = 'true'", (err, res) => {
        console.log(sql.query);
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};
// EXPORT MODEL (required by CONTROLLER)
module.exports = Activity;