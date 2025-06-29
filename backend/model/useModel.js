const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
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
    accounts:{
        type: [{
            accountType: {
                type: String,
                required: true,
                enum: ['savings', 'Susu', 'Investment', 'Loan']
            },
            accountNumber: {
                type: String,
                required: true,
                unique: true
            },
            customerId: {
                type: String,
                required: true,
                unique: true
            },
            balance: {
                type: Number,
                default: 0
            },
            interestRate: {
                type: Number,
                default: 0
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        default: [],
        required: true
    },
    transactions: {
        type: [{
            type: {
                type: String,
                required: true,
                enum: ['deposit', 'withdrawal', 'transfer']
            },
            performedOnAccount: {
                type: String,
                required: true,
                enum: ['savings', 'Susu', 'Investment', 'Loan']
            },
            amount: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            },
            description: {
                type: String,
                trim: true
            },
            perfBy: {
                type: String,
                default: 'user'
            },
        }],
        default: [],
        required: true},
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },  
    image:{
        type: String,
        default: 'https://static.vecteezy.com/system/resources/previews/016/079/150/non_2x/user-profile-account-or-contacts-silhouette-icon-isolated-on-white-background-free-vector.jpg'
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


})

module.exports = mongoose.model('User', userSchema);

// This code defines a Mongoose schema for a user model in a Node.js application.