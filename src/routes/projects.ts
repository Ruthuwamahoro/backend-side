import express, {Router} from 'express'
const router:Router = express.Router();
import cookieParser from 'cookie-parser'; 
import passport from 'passport'
import {allowUserToSeePostedProject, allowPostProject, allowUpdateProject, allowDeleteProject} from '../controllers/projectsController'

//////////////////////////////////////////////////////////////////////////////////


//define middleware
router.use(cookieParser())
router.use(express.json())
router.use(passport.initialize())

/////////////////////////////////////////////////////////////////////////////////////

//define routes


router.get('/getallprojects', allowUserToSeePostedProject)
router.post('/postproject', allowPostProject)
router.patch('/updateproject/:id', allowUpdateProject)
router.delete('/deleteproject/:id', allowDeleteProject)

// //////////////////////////////////////////////////////////////////////////////////////////////////

export default router; 