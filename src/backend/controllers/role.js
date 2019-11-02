const {Hacker, Role} = require('@b/models');

exports.getRoles = () => {
    return Role.find().exec();
}

exports.createRole = (name, fields) => {
    return Role.findOne({name: name}).then(existingRole => {
        if (existingRole) {
            throw new Error('A role with this name already exists');
        }

        let role = new Role({
            name: name,
            fields: fields
        });

        return role.save();
    });
}

exports.updateRole = (id, name, fields) => {
    return Role.findOneAndUpdate({_id: id}, {name: name, fields: fields}).exec();
}

exports.deleteRoleAndHackers = (id) => {
    return Role.deleteOne({_id: id}).then(() => {
        return Hacker.deleteMany({role: id}).exec();
    });
}
