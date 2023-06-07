const express = require('express');

//Sending Mail Operation
const emailSchedule = require('../middleware/email');

//CRUD Operations
const scheduleController = require('../controller/schedule');

const router = express.Router();

//router for Creating Mail Schedule
router.post('/post', scheduleController.postMail, emailSchedule.scheduler);

//router for Reading Mail Schedule
router.get('/get', scheduleController.getMails);

//router for Deleting Mail Schedule
router.delete('/delete/:mailId', scheduleController.deleteMail, emailSchedule.deleteScheduler);

//router for Rescheduling Mail Schedule
router.patch('/patch', scheduleController.patchMail, emailSchedule.reScheduler);

//router for Reading Unsent Mails
router.get('/unsent', scheduleController.unsentMails);

module.exports = router;