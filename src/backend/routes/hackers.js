const hackerController = require('@b/controllers/hacker');
const middleware = require('@b/middleware');
const {UnauthorizedError, InsufficientRoleError} = require('@b/errors');
const joi = require('@hapi/joi');

const hackerSchema = joi.object().keys({
  name: joi.string().required(),
  email: joi.string().email().required(),
  description: joi.string(),
  qr: joi.number().positive().required(),
  role: joi.string().alphanum().length(24).required(),
  checkin: joi.boolean().optional()
});

const updateHackerSchema = joi.object().keys({
  fields: joi.array().items(joi.object().keys({
    name: joi.string().required(),
    attributes: joi.array().items(joi.object().keys({
      had: joi.boolean().required(),
      name: joi.string().required()
    })).required()
  })).optional(),
  checkin: joi.boolean()
});

const toggleSchema = joi.object().keys({
  name: joi.string().required(),
  attribute: joi.string().required()
});

module.exports = function(router) {
  router.get('/api/hackers', middleware.authorize(), (req, res) => {
    return hackerController.getAllHackers().then(hackers => {
      res.json({'message': 'Successfully retrieved hackers', 'hackers': hackers});
    }).catch(err => {
      res.json({'error': 'There was an error retrieving the hackers'});
    });
  });

  router.post('/api/hackers', middleware.authorize({roles: ['admin']}), middleware.validate(hackerSchema), (req, res) => {
    return hackerController.createHacker(req.auth.account._id, req.body.name, req.body.email, req.body.description, req.body.qr, req.body.role, req.body.checkin).then(hacker => {
      res.json({'message': 'Successfully created hacker', 'hacker_qr': hacker.qr});
    }).catch(err => {
      res.json({'error': `Unable to create hacker: ${err.message || err}`});
    });
  });

  router.get('/api/hackers/:hacker_qr', middleware.authorize(), (req, res) => {
    return hackerController.getHacker(req.params.hacker_qr).then(hacker => {
      res.json({'message': 'Successfully retrieved hacker', 'hacker': hacker});
    }).catch(err => {
      res.json({'error': 'Unable to find a hacker with that qr code'});
    });
  });

  router.post('/api/hackers/:hacker_qr', middleware.authorize(), middleware.validate(updateHackerSchema), (req, res) => {
    return hackerController.updateHacker(req.auth.account._id, req.params.hacker_qr, req.body.fields, req.body.checkin).then((hacker) => {
      return res.json({'message': 'Successfully updated hacker'});
    }).catch(err => {
      res.json({'error': 'Unable to find a hacker with that qr code'});
    });
  });

  router.post('/api/hackers/:hacker_qr/active', middleware.authorize({roles: ['admin']}), (req, res) => {
    return hackerController.toggleActive(req.auth.account._id, req.params.hacker_qr).then(() => {
      res.json({'message': 'Successfully updated the hacker'});
    }).catch(err => {
      res.json({'error': 'Unable to find a hacker with that qr code'});
    });
  });

  router.post('/api/hackers/:hacker_qr/toggle', middleware.authorize(), middleware.validate(toggleSchema), (req, res) => {
    return hackerController.toggleFieldTrue(req.auth.account._id, req.params.hacker_qr, req.body.name, req.body.attribute).then(() => {
      res.json({'message': 'Successfully updated the hacker'})
    }).catch(err => {
      res.json({'error': 'Unable to toggle this field for hacker'});
    });
  });

  router.post('/api/hackers/:hacker_qr/checkin', middleware.authorize(), (req, res) => {
    return hackerController.toggleCheckinTrue(req.auth.account._id, req.params.hacker_qr).then(() => {
      res.json({'message': 'Successfully checked in hacker'});
    }).catch(err => {
      res.json({'error': 'Unable to checkin hacker'});
    });
  });
}
