const {Hacker, Role} = require('@b/models');
const interactionsController = require('@b/controllers/interaction');
const c = require('@b/const');

exports.getRoles = () => {
    return Role.find().exec();
}

exports.createRole = (user_id, name, fields) => {
    return Role.findOne({name: name}).then(existingRole => {
        if (existingRole) {
            throw new Error('A role with this name already exists');
        }

        let role = new Role({
            name: name,
            fields: fields
        });

        return role.save();
    }).then(role => {
        return interactionsController.createInteraction(`Created role ${role.name}`, c.interactions.CREATE, user_id);
    });
}

exports.updateRole = (user_id, id, name, fields) => {
    return Role.findOneAndUpdate({_id: id}, {name: name, fields: fields}).then(role => {
        return interactionsController.createInteraction(`Updated role ${role.name}`, c.interactions.EDIT, user_id);
    });
}

exports.deleteRoleAndHackers = (user_id, id) => {
    return Role.findOneAndRemove({_id: id}).then(role => {
        return interactionsController.createInteraction(`Deleted role ${role.name}`, c.interactions.DELETE, user_id);
    }).then(() => {
        return Hacker.deleteMany({role: id}).exec();
    });
}
