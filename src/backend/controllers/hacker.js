const {Hacker, Role} = require('@b/models');

exports.getAllHackers = () => {
    return Hacker.find().select('-_id -fields').exec();
};

exports.getHacker = (qr) => {
    return Hacker.findOne({qr: qr}).select('-_id').exec();
};

exports.createHacker = (name, email, qr, role_id) => {
    return Hacker.findOne({qr: qr}).then(hacker => {
        if (hacker) {
            throw new Error('A hacker with this qr code already exists');
        }

        return Role.findById(role_id).lean().exec();
    }).then(role => {
        if (!role) {
            throw new Error('Invalid role');
        }

        let fields = role.fields.map(field => {
            let attributes = field.attributes.map(attribute => {
                return {
                    'name': attribute,
                    'had': false
                }
            });

            return {
                ...field,
                attributes: attributes
            }
        });

        let hacker = new Hacker({
            name: name,
            email: email,
            qr: qr,
            fields: fields
        });

        return hacker.save();
    });
};

exports.updateHacker = (qr, fields) => {
    return Hacker.findOneAndUpdate({
        qr: qr
    }, {
        $set: {
            fields: fields
        }
    }).exec();
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
