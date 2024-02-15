const jwt = require('jsonwebtoken')
function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const accToken = authHeader && authHeader.split(' ')[1]
    if(accToken == null){
        return res.sendStatus(401) // unauthorized
    }
    jwt.verify(accToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err)return res.sendStatus(403) // forbidden
        req.user = user
        next()
    }) 
}
module.exports = authenticateToken