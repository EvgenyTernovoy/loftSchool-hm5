const express = require('express');
const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const newsController = require('../controllers/news');

const router = express.Router();

//router.all('*', authController.checkToken);

router.post('/api/saveNewUser', authController.registration);
router.post('/api/login', authController.authentication);
router.post('/api/authFromToken', authController.checkToken);

router.get('/api/getUsers', userController.getList);
router.put('/api/updateUser/:id', userController.update);
router.put('/api/updateUserPermission/:id', userController.updateUserPermissions);
router.post('/api/saveUserImage/:id', userController.uploadImage);
router.delete('/api/deleteUser/:id', userController.deleteItem);

router.get('/api/getNews', newsController.get);
router.post('/api/newNews', newsController.create);
router.put('/api/updateNews/:id', newsController.update);
router.delete('/api/deleteNews/:id', newsController.deleteItem);




module.exports = router;
