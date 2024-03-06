////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//import necessary module

import express, {Router} from 'express'
import passport from 'passport'
import multer from 'multer';
import path from 'path'
import { authenticateToSeeAllBlogIn, accessSingleBlog, authenticateToPostBlog, deleteSingleBlog, updateSingleBlog } from '../controllers/blogsController'

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const router:Router = express.Router();
router.use(express.json())
router.use(passport.initialize())

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//upload image to the blog by using multer
//filename must be unique to prevent overwriting of files

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        return cb(null, `${file?.fieldname}_${Date.now()}${path.extname(file?.originalname)}` ) //this takes two parameters error and return value.extname is extension name
    }
})
const upload = multer ({
    storage : storage
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/retrieveallpost', authenticateToSeeAllBlogIn);
router.post('/postblog', upload.single('image'),authenticateToPostBlog)
router.get('/getsinglepost/:id',accessSingleBlog)
router.delete('/deletepost/:id',deleteSingleBlog)
router.patch('/updatepost/:id', updateSingleBlog)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default router
