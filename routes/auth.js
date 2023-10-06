const router = require('express').Router();
const { handleLogin } = require('../controllers/authController');

router.post('/', handleLogin);

module.exports = router;

