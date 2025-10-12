exports.isAdmin = (req,res,next) => {
    if(!req.user.isAdmin) {
        return res.status(403).json({success:false, error:'Not authorized as admin'})
    }
    next();
}