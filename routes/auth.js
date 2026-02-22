const express= require('express');
const {register,login} = require('../controllers/auth');
const router = express.Router();
const {protect} = require('../middleware/auth');
const { getMe } = require('../controllers/auth');

router.post('/register',register);
router.post('/login',login);
router.get('/me',protect,getMe);



module.exports = router;
