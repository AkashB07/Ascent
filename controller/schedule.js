const Schedule = require('../models/schedule');

//Validating the variables recieved from the Front-End
function isstringinvalid(string) {
    if (string == undefined || string.length === 0) {
        return true;
    }
    else {
        return false;
    }
}


//Creating a new Mail Schedule
const postMail = async (req, res, next) => {
    try {   
        const { email, time, subject, body } = req.body;

        if (isstringinvalid(email) || isstringinvalid(time) || isstringinvalid(subject) || isstringinvalid(body)) {
            return res.status(400).json({ err: "Bad parameters. Something is missing" });
        }     

        await Schedule.create({email:email, time:time, subject: subject, body:body});
        next();      
    }
    catch (error) {
        res.status(500).json({ message: error, success: false });
    }
}


//Reading the created Mail Schedules
const getMails = async (req, res) => {
    try {   
        const mails =  await Schedule.find();
        return res.status(200).json({mails: mails, succese: true});            
    }
    catch (error) {
        res.status(500).json({ message: error, success: false });
    }
}


//Deleting the Mail Schedule
const deleteMail = async (req, res, next) => {
    try {   
        const mailId = req.params.mailId;
        if(isstringinvalid(mailId))
        {
            return res.status(400).json({succese: false});
        }

        await Schedule.findByIdAndDelete(mailId);
        next();       
    }
    catch (error) {
        res.status(500).json({ message: error, success: false });
    }
}


// Rescheduling the Mail Schedule
const putMail = async (req, res, next) => {
    try {   
        const { _id, email, time, subject, body } = req.body;

        if (isstringinvalid(_id) || isstringinvalid(email) || isstringinvalid(time) || isstringinvalid(subject) || isstringinvalid(body)) {
            return res.status(400).json({ err: "Bad parameters. Something is missing" });
        }   

        await Schedule.findByIdAndUpdate(_id, {email:email, time:time, subject: subject, body:body});
        next();
    }
    catch (error) {
        res.status(500).json({ message: error, success: false });
    }
}


//Reading the list of Unsent or failed Mails
const unsentMails = async (req, res) => {
    try {   
        const failed =  await Schedule.find({where: {sent: false}});

        if(failed.length>0){
            return res.status(200).json({failed: failed, message: 'Unset Mails found', succese: true});  
        }

        return res.status(404).json({message: 'All Mails are sent', success: false});    
    }
    catch (error) {
        res.status(500).json({ message: error, success: false });
    }
}


module.exports ={
    postMail,
    getMails,
    deleteMail,
    putMail,
    unsentMails
}