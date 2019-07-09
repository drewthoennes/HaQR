const {Hacker} = require('@b/models');

exports.getAllHackers = (qr) => {
    return Hacker.find().select('-_id -fields').exec();
};

exports.getHacker = (qr) => {
    return Hacker.findOne({qr: qr}).select('-_id').exec();
};

exports.createHacker = (name, email, qr, fields) => {
    let hacker = new Hacker({
        name: name,
        email: email,
        qr: qr,
        fields: fields
    });

    return hacker.save();
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

exports.toggleActive = (qr) => {
    return Hacker.findOne({qr: qr}).then(hacker => {
        return Hacker.findOneAndUpdate({
            qr: qr
        }, {
            $set: {
                active: !hacker.active
            }
        });
    });
};
