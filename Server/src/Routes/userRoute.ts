import express from 'express'
import { signUp, login , updateProfile } from '../Controller/UserController'
import { authenticateUser } from '../Middlewear/authMiddlewear'
const router = express.Router()


router.post('/signup', signUp)
.post('/login', login)
.post('/updateProfile' ,authenticateUser, updateProfile)
// .post('/updateProfile' ,authenticateUser, upload, updateProfile)

export default router 