const {Interaction} = require('@b/models');
const userController = require('@b/controllers/user');
const MAX_INTERACTIONS = 20;

exports.getInteractions = () => {
    let list;

    return Interaction.find()
        .sort({createdAt: -1})
        .limit(MAX_INTERACTIONS)
        .select('-updatedAt')
        .populate('user', '-_id name')
    .then(interactions => {
        list = interactions;

        return Interaction.countDocuments({});
    }).then(count => {
        return {
            list: list,
            total: count
        }
    });
}

exports.createInteraction = (description, type, user_id) => {
    return userController.getUser(user_id).then(user => {
        if (!user) {
            throw new Error('Given user does not exist');
        }

        let interaction = new Interaction({
            description: description,
            type: type,
            user: user_id
        });

        return interaction.save();
    });
}

exports.deleteInteraction = (id) => {
    return Interaction.findOneAndRemove({_id: id}).then(interaction => {
        if (!interaction) throw new Error('No interaction with this id exists');
    });
}

exports.deleteInteractions = () => {
    return Interaction.deleteMany();
}
