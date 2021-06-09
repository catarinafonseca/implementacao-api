const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
    'sql11405174', 'sql11405174', 'Nv3pX7kMrT',
    {
        host: 'sql11.freemysqlhosting.net',
        dialect: 'mysql'
    }
);
 
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
 
        const Atividade = sequelize.define("atividade", {
            nome: DataTypes.STRING,
            desc_atividade: DataTypes.STRING,
            num_participantes: DataTypes.INTEGER,
            imagem: DataTypes.STRING,
            certificado_SN: DataTypes.STRING,
            data_hora: DataTypes.DATE,
            idLocal: DataTypes.INTEGER
        }, {
            timestamps: false
        });
 
        const Categoria = sequelize.define("categoria", {
            desc_categoria: DataTypes.STRING
        }, {
            timestamps: false
        });
 
        //define the 1:N relationship
        Categoria.hasMany(Atividade);
        Atividade.belongsTo(Categoria);
 
        Categoria.sync({ force: true }); //didn't exist so create table
        Atividade.sync({ force: true }); //user existed so alter
 
        // sequelize.sync({ force: true })
        //     .then(() => {
        //         console.log("DB sync");
        //     });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });