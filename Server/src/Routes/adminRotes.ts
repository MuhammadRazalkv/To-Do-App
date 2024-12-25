import express from 'express'
import { adminLogin , userList , deleteUser , getUser , editUser} from '../Controller/AdminController'
import { authenticateAdmin } from '../Middlewear/AdminAuthMiddlewear'


const adminRouter = express.Router()
adminRouter.post('/login',adminLogin)
.get('/users',authenticateAdmin,userList)
.delete('/userDelete/:id',authenticateAdmin,deleteUser)
.get('/getUser/:id',authenticateAdmin,getUser)
.post('/editUser/:id',authenticateAdmin,editUser)

export default adminRouter