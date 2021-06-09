const express = require('express');
let router = express.Router();
const quizController = require('../controllers/quizzes.controller');
const authController= require("../controllers/auth.controller");

router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(authController.verifyToken,quizController.findAll)
    .post(authController.verifyToken,authController.isProfessor,quizController.create)

 router.route('/:quizID')
    .get(authController.verifyToken,quizController.findOne)
    .delete(authController.verifyToken,authController.isAdmin,quizController.delete)

//send a predefined error message for invalid routes on users
router.all('*', function (req, res) {
    res.status(404).json({ message: 'QUIZZES: what???' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;