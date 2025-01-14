import express from 'express'
const router = express.Router();
import {test, updateUser, deleteUser, signout, getUsers, getUser} from '../controllers/userControllers.js'
import { verifyToken } from '../utils/verifyUser.js';


router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/sign-out', signout);
router.get('/getusers', verifyToken, getUsers);
router.get('/:userId', getUser);


export default router;
