const router = require('express').Router();
const { handleLogout } = require('../controllers/logoutController');

router.get('/', handleLogout);

module.exports = router;

