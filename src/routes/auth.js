const {Hacker} = require('@b/models');
const joi = require('@hapi/joi');
const c = require('@b/const');

const loginSchema = joi.object().keys({
  username: joi.string().alphanum().required(),
  password: joi.string().alphanum().min(6).regex(/\d/).required()
});

module.exports = function(router) {
  router.post('/auth/login', (req, res) => {
    if (joi.validate(req.body, loginSchema).error !== null) {
      res.status(c.status.OK).json({'error': 'Invalid fields'});
      return;
    }
  });
}
