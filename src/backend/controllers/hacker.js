const {Hacker, Role} = require('@b/models');

exports.getAllHackers = () => {
    return Hacker.find().select('-_id -fields').exec();
};

exports.getHacker = (qr, id) => {
    return Hacker.findOne({qr: qr}).select(id ? '' : '-_id').then(hacker => {
        if (!hacker) {
            throw new Error('A hacker with this QR does not exist');
        }

        return hacker;
    });
};

exports.createHacker = (name, email, qr, role_id) => {
    return Hacker.findOne({qr: qr}).lean().then(hacker => {
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
            fields: fields,
            role: role_id
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

exports.toggleFieldTrue = (qr, name, attrib) => {
    return exports.getHacker(qr, true).then(hacker => {
        let found = false;
        let alreadyTrue = false;

        hacker.fields = hacker.fields.map(field => {
            if (field.name == name) {
                field.attributes = field.attributes.map(attribute => {
                    if (attribute.name == attrib) {
                        found = true;
                        alreadyTrue = alreadyTrue || attribute.had;

                        return Object.assign(attribute, {had: true});
                    }

                    return attribute;
                });
            }

            return field;
        });

        if (!found) {
            throw new Error('Hacker does not have this field');
        }
        else if (alreadyTrue) {
            throw new Error('Field is already true for this hacker');
        }

        return hacker.save();
    });
};
