
import express, { Router } from 'express'
import passport from 'passport'
import { allowUserToSubmitMessage, retrieveAllMessage, deleteMessage } from "../controllers/contactMessageController";
// /////////////////////////////////////////////////////////////////////////////////////////////////
//define middleware

const Crouter:Router = express.Router();

Crouter.use(express.json())
Crouter.use(passport.initialize())


///////////////////////////////////////////////////////////////////////////////////////////////////////////////

Crouter.post('/contactmessage', allowUserToSubmitMessage)
Crouter.get('/contactmessage', retrieveAllMessage ) 
Crouter.delete('/deletemessage/:id', deleteMessage )

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default Crouter