const {Config} = require('@b/models');
const interactionsController = require('@b/controllers/interaction');
const c = require('@b/const');

exports.getConfig = () => {
    return Config.findOne({}).select('-_id -__v').then(config => {
        // Create default config if it doesn't exist
        if (!config) {
            let config = new Config({});
            return config.save();
        }

        return config;
    });
};

exports.updateConfig = (user_id, config) => {
    return Config.findOneAndUpdate({}, {
        $set: config
    }, {
        upsert: true // Create config if one doesn't already exist
    }).then(() => {
        return interactionsController.createInteraction(`Updated application settings`, c.interactions.EDIT, user_id);
    });
};
