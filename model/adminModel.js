const moogoose = require('mongoose');
const { Schema } = moogoose;

const adminSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    role:{
        type: String,
        required: true,
        enum: ['admin', 'senioradmin', 'manager'], 
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = moogoose.model('Admin', adminSchema);
    