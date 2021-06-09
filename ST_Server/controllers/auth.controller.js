const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = require("../config/auth.config.js");
const sql = require("../models/db.js");
const User = require('../models/users.model.js');

exports.signup = async (req, res) => {
  try {
    // check duplicate email
    await User.findByEmail(req.body.email, (err, data) => {
      let user = data;
     
      if (!req.body || !req.body.nome || !req.body.email || !req.body.password || !req.body.foto || !req.body.idCurso || !req.body.data_nasc) {
        
        res.status(400).json({ message: "Please check if all variables are filled!" });
        return;
      }
      if (user)
      {
        
        return res
        .status(400)
        .json({ message: "Failed! Email is already in use!" });

      }
        
      user = User.create({
        nome: req.body.nome,
        email: req.body.email,
        idTipo: 1,
        password: bcrypt.hashSync(req.body.password, 8),
        foto: req.body.foto,
        idCurso: req.body.idCurso,
        data_nasc: req.body.data_nasc,
        idNivel: 1,
        pontuacao: 100,
        blocked: "false",
       
      });
      return res.json({ message: "User was registered successfully!" });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.signin = async (req, res) => {
  try {
    await User.findByEmail(req.body.email, (err, data) => {
      console.log(data);
      /* let user = data; */
      if (data == null) {
        return res.status(404).json({ message: "User Not found." });
      }
      console.log(req.body.password)
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        data.password
      );
      //const passwordIsValid = req.body.password == user.password ? true : false;
      if (!passwordIsValid) {
        return res.status(401).json({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      const token = jwt.sign({ idUtilizador: data.idUtilizador }, config.secret, {
        expiresIn: 5356800, // 2 months
      });
      return res.status(200).json({
        idUtilizador: data.idUtilizador,
        nome: data.nome,
        email: data.email,
        idTipo: data.idTipo,
        token: token,
        foto: data.foto,
        idCurso:data.idCurso,
        data_nasc:data.data_nasc,
        idNivel:data.idNivel,
        pontuacao:data.pontuacao,
        blocked:data.blocked,
        

      });
    });

    // sign the given payload (user ID) into a JWT payload –builds JWT token,using secret key
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};
exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    
    return res.status(403).send({
      
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.loggedUserId = decoded.idUtilizador; // save user ID for future verifications
    next();
  });
};
exports.isProfessor = async (req, res, next) => {
  await User.findById(req.loggedUserId, (err, data) => {
    console.log(data);
    if (data.idTipo !== 2) {
      return res.status(403).send({ message: "Require Professor Role!" });
    }
    next();
  })
};
exports.isAdmin = async (req, res, next) => {
  await User.findById(req.loggedUserId, (err, data) => {
    console.log(data);
    if (data.idTipo !== 3) {
      return res.status(403).send({ message: "Require Admin Role!" });
    }
    next();
  })
};
exports.isAdminOrProfessor= async (req, res, next) => {
  await User.findById(req.loggedUserId, (err, data) => {
    console.log(data);
    if (data.idTipo === 1 ) {
      return res.status(403).send({ message: "Require Admin Role or Professor login!" });
    }
    next();
  })
};
exports.isAdminOrLoggedUser= async (req, res, next) => {
  await User.findById(req.loggedUserId, (err, data) => {
    console.log(data);
    if (data.idTipo !== 3 && data.idTipo !== 1) {
      return res.status(403).send({ message: "Require Admin Role or Student login!" });
    }
    next();
  })
};