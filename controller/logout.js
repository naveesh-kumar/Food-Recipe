module.exports = (req, res, next)=>{
    if(res.locals.authenticated){
        //if there is a token delete that token
        res.clearCookie("x-jwt-token");
    }
    res.redirect("/");
}