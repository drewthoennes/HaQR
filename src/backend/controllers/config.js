const {Config} = require('@b/models');

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

exports.updateConfig = (config) => {
    return Config.findOneAndUpdate({}, {
        $set: config
    }, {
        upsert: true // Create config if one doesn't already exist
    }).exec();
};
