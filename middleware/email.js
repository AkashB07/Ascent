const schedule = require('node-schedule');
const Sib = require('sib-api-v3-sdk');

const Schedule = require('../models/schedule');

const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY;

const Jobs = {};

//Converting the Sheduled date and time to cronjob
const dateToCron = (date) => {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const days = date.getDate();
    const months = date.getMonth() + 1;
    const dayOfWeek = date.getDay();

    return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
};

// Creating a Schedule email message using SendInBlue
const scheduler = async (req, res, next) => {
    try {
        const cron = dateToCron(new Date(req.mail.time));

        Jobs[req.mail._id] = schedule.scheduleJob(cron, () => {

            const tranEmailApi = new Sib.TransactionalEmailsApi()
            const sender = {
                email: 'akashbadhi7@gmail.com',
                name: 'Akash B',
            }
            const receivers = [
                {
                    email: req.mail.email,
                }
            ]

            tranEmailApi
                .sendTransacEmail({
                    sender,
                    to: receivers,
                    subject: req.mail.subject,
                    textContent: req.mail.body,

                })
                //Mail is sent
                .then(async () => {
                    await Schedule.findByIdAndUpdate(req.mail._id, { sent: true });
                })
                //Mail is unsent
                .catch(async () => {
                    await Schedule.findByIdAndUpdate(req.mail._id, { sent: false });
                })
        });
        return res.status(200).json({message: 'Successfully Scheduled the email', succese: true});      

    }
    catch (error) {
        return res.status(401).json({ success: false })
    }
}

// Re-Scheduling email time
const reScheduler = async (req, res, next) => {
    try {
        const cron = dateToCron(new Date(req.mail.time));
        Jobs[req.mail._id].reschedule(cron);
        return res.status(200).json({message: 'Successfully Re-Scheduled the email', succese: true});      
    }
    catch (error) {
        return res.status(401).json({ success: false })
    }
}

// Deleting the Scheduled
const deleteScheduler = async (req, res, next) => {
    try {
        Jobs[req.mail._id].cancel();
        return res.status(200).json({message: 'Successfully Deleted the Scheduled email', succese: true});      
    }
    catch (error) {
        return res.status(401).json({ success: false })
    }
}

module.exports = {
    scheduler,
    reScheduler,
    deleteScheduler
}