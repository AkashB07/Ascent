const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Creating a Schedule Collection
const scheduleSchema = new Schema({ 
    email: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    sent: {
        type: Boolean
    }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
