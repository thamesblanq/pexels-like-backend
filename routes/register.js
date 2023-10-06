const router = require('express').Router();
const { handleNewUser } = require('../controllers/registerController');

router.post('/', handleNewUser);


module.exports = router;