const fs  =require('fs');

const errorHandler = (err, req, res, next) => {
    const errMessage = `${new Date().toDateString()} - ${err.stack} \n`
    fs.appendFile('ErrorLogger.txt',errMessage,(error)=>{
        if(error)
        console.log("Failed in logging error")
    })
    if(err.status){
        res.status(err.status).json({"message":err.message});
    }
    else
        res.status(500).json({"message":err.message})
};

module.exports = errorHandler;