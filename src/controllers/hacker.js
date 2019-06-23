const {Hacker} = require('@b/models');
const bluebird = require('bluebird');

exports.getAllHackers = (qr) => {
    return Hacker.find().select('-_id -fields').exec();
};

exports.getHacker = (qr) => {
    return Hacker.findOne({qr: qr}).select('-_id -fields').exec();
};

exports.updateHacker = (qr, fields) => {
    return Hacker.findOneAndUpdate({
        qr: qr
    }, {
        $set: {
            fields: fields
        }
    }).exec()
};
