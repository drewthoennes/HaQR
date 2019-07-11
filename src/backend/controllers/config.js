const {Config} = require('@b/models');

exports.getConfig = () => {
    return Config.findOne({}).select('-_id').exec();
};

exports.updateConfig = (config) => {
    return Config.findOneAndUpdate({}, {
        $set: config
    }).exec();
};