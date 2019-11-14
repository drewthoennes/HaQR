const {Hacker, Role} = require('@b/models');
const interactionsController = require('@b/controllers/interaction');
const c = require('@b/const');

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

exports.createHacker = (user_id, name, email, description, qr, role_id) => {
    let ret;

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
            description: description,
            qr: qr,
            fields: fields,
            role: role_id
        });

        return hacker.save();
    }).then(hacker => {
        ret = hacker;
        return interactionsController.createInteraction(`Created hacker ${hacker.name}`, c.interactions.CREATE, user_id);
    }).then(() => {
        return ret;
    });
};

exports.updateHacker = (user_id, qr, fields) => {
    return Hacker.findOneAndUpdate({
        qr: qr
    }, {
        $set: {
            fields: fields
        }
    }).then(hacker => {
        return interactionsController.createInteraction(`Updated hacker ${hacker.name}`, c.interactions.EDIT, user_id);
    });
};

exports.toggleActive = (user_id, qr) => {
    return Hacker.findOne({qr: qr}).then(hacker => {
        return Hacker.findOneAndUpdate({
            qr: qr
        }, {
            $set: {
                active: !hacker.active
            }
        });
    }).then(hacker => {
        return interactionsController.createInteraction(`Toggled active hacker ${hacker.name}`, c.interactions.EDIT, user_id);
    });
};

exports.toggleFieldTrue = (user_id, qr, name, attrib) => {
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
    }).then(hacker => {
        return interactionsController.createInteraction(`Scanned for field for hacker ${hacker.name}`, c.interactions.EDIT, user_id);
    });
};
