const router = require('express').Router();
const { handleRefreshToken } = require('../controllers/refreshTokenController');

router.get('/', handleRefreshToken);

module.exports = router;

