const express = require('express');
let router = express.Router();
const userController = require('../controllers/users.controller');
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
    .get(authController.verifyToken,authController.isAdmin,userController.findAll)

router.route('/:userID')
    .get(authController.verifyToken,authController.isAdminOrLoggedUser,userController.findOne)
    .delete(authController.verifyToken,authController.isAdmin,userController.delete)
    .put(authController.verifyToken,authController.isAdminOrLoggedUser,userController.update)
    .patch(authController.verifyToken,authController.isAdmin,userController.blockOrPromote);

//send a predefined error message for invalid routes on users
router.all('*', function (req, res) {
    res.status(404).json({ message: 'USERS: what???' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;