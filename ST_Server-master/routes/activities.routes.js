const express = require('express');
let router = express.Router();
const activityController = require('../controllers/activities.controller');
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
    .get(authController.verifyToken, activityController.findAll)
    .post(authController.verifyToken, authController.isProfessor,activityController.create)

router.route('/concluded')
    .get(authController.verifyToken, activityController.findAllConcluded)

router.route('/:activityID')
    .get(authController.verifyToken, activityController.findOne)
    .delete(authController.verifyToken, authController.isAdminOrProfessor,activityController.delete)
    .put(authController.verifyToken, authController.isAdminOrProfessor,activityController.update);

//send a predefined error message for invalid routes on activities
router.all('*', function (req, res) {
    res.status(404).json({ message: 'ACTIVITIES: what???' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;