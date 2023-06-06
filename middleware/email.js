const schedule = require('node-schedule');
const Sib = require('sib-api-v3-sdk');

const Schedule = require('../models/schedule');

const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY;

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
        const response = await Schedule.find();

        if (response) {
            response.forEach((mail) => {
                const cron = dateToCron(mail.time);

                const job = schedule.scheduleJob(cron, () => {

                    const tranEmailApi = new Sib.TransactionalEmailsApi()
                    const sender = {
                        email: 'akashbadhi7@gmail.com',
                        name: 'Akash B',
                    }
                    const receivers = [
                        {
                            email: mail.email,
                        },
                    ]

                    tranEmailApi
                        .sendTransacEmail({
                            sender,
                            to: receivers,
                            subject: mail.subject,
                            textContent: mail.body,

                        })
                        //Mail is sent
                        .then(async () => {
                            await Schedule.findByIdAndUpdate(mail._id, { sent: true });
                        })
                        //Mail is unsent
                        .catch(async () => {
                            await Schedule.findByIdAndUpdate(mail._id, { sent: false });
                        })
                });

            })
        }
    }
    catch (error) {
        return res.status(401).json({ success: false })
    }
}

module.exports = {
    scheduler
}