const mongoose = require('mongoose');
const encryption = require('../utils/encryption');

function getRequiredFieldMessage(field) {
    return `${field} is required`;
}

let userSchema = mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: getRequiredFieldMessage('Username'),
        unique: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: getRequiredFieldMessage('Password'),
    },
    firstName: {
        type: mongoose.Schema.Types.String,
        required: getRequiredFieldMessage('First name')
    },
    lastName: {
        type: mongoose.Schema.Types.String,
        required: getRequiredFieldMessage('Last name')
    },
    age: { type: mongoose.Schema.Types.Number },
    gender: { type: mongoose.Schema.Types.String },
    salt: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    roles: [{ type: mongoose.Schema.Types.String }],
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }]
});

userSchema.method({
    authenticate: function (password) {
        let hashedPassword = encryption.generateHashedPassword(this.salt, password);

        return hashedPassword === this.password;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;