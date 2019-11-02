const hackerController = require('@b/controllers/hacker');
const middleware = require('@b/middleware');
const {UnauthorizedError, InsufficientRoleError} = require('@b/errors');
const joi = require('@hapi/joi');

const hackerSchema = joi.object().keys({
  name: joi.string().required(),
  email: joi.string().email().required(),
  qr: joi.number().positive().required(),
  role: joi.string().alphanum().length(24)
});

const updateHackerSchema = joi.object().keys({
  fields: joi.array().items(joi.object().keys({
    name: joi.string().required(),
    attributes: joi.array().items(joi.object().keys({
      had: joi.boolean().required(),
      name: joi.string().required()
    })).required()
  })).required()
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
      switch (true) {
        case err instanceof UnauthorizedError:
          res.status(401).json({'error': err.message});
          break;

        case err instanceof InsufficientRoleError:
          res.status(401).json({'error': err.message});
          break;

        default:
            res.status(500).json({'error': 'There was an error retrieving the hackers'});
          break;
      }
    });
  });

  router.post('/api/hackers', middleware.validate(hackerSchema), middleware.authorize({roles: ['admin']}), (req, res) => {
    return hackerController.createHacker(req.body.name, req.body.email, req.body.qr, req.body.role).then(hacker => {
      res.json({'message': 'Successfully created hacker', 'hacker_qr': hacker.qr});
    }).catch(err => {
      switch (true) {
        case err instanceof UnauthorizedError:
          res.status(401).json({'error': err.message});
          break;

        case err instanceof InsufficientRoleError:
          res.status(401).json({'error': err.message});
          break;

        default:
          res.status(500).json({'error': 'Unable to create hacker'});
          break;
      }
    });
  });

  router.get('/api/hackers/:hacker_qr', middleware.authorize(), (req, res) => {
    return hackerController.getHacker(req.params.hacker_qr).then(hacker => {
      res.json({'message': 'Successfully retrieved hacker', 'hacker': hacker});
    }).catch(err => {
      switch (true) {
        case err instanceof UnauthorizedError:
          res.status(401).json({'error': err.message});
          break;

        case err instanceof InsufficientRoleError:
          res.status(401).json({'error': err.message});
          break;

        default:
            res.status(500).json({'error': 'Unable to find a hacker with that qr code'});
          break;
      }
    });
  });

  router.post('/api/hackers/:hacker_qr', middleware.validate(updateHackerSchema), middleware.authorize(), (req, res) => {
    return hackerController.updateHacker(req.params.hacker_qr, req.body.fields).then((hacker) => {
      return res.json({'message': 'Successfully updated hacker'});
    }).catch(err => {
      switch (true) {
        case err instanceof UnauthorizedError:
          res.status(401).json({'error': err.message});
          break;

        case err instanceof InsufficientRoleError:
          res.status(401).json({'error': err.message});
          break;

        default:
            res.status(500).json({'error': 'Unable to find a hacker with that qr code'});
          break;
      }
    });
  });

  router.post('/api/hackers/:hacker_qr/active', middleware.authorize({roles: ['admin']}), (req, res) => {
    return hackerController.toggleActive(req.params.hacker_qr).then(() => {
      res.json({'message': 'Successfully updated the hacker'})
    }).catch(err => {
      switch (true) {
        case err instanceof UnauthorizedError:
          res.status(401).json({'error': err.message});
          break;

        case err instanceof InsufficientRoleError:
          res.status(401).json({'error': err.message});
          break;

        default:
            res.status(500).json({'error': 'Unable to find a hacker with that qr code'});
          break;
      }
    });
  });

  router.post('/api/hackers/:hacker_qr/toggle', middleware.validate(toggleSchema), (req, res) => {
    return hackerController.toggleFieldTrue(req.params.hacker_qr, req.body.name, req.body.attribute).then(() => {
      res.json({'message': 'Successfully updated the hacker'})
    }).catch(err => {
      switch (true) {
        case err instanceof UnauthorizedError:
          res.status(401).json({'error': err.message});
          break;

        case err instanceof InsufficientRoleError:
          res.status(401).json({'error': err.message || err});
          break;

        default:
            res.json({'error': err.message || err});
          break;
      }
    });
  });
}
