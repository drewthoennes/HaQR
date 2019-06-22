const {Workspace} = require('@b/models');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

/*
 * Check whether the object contains all keys in array
 *
 * @arg     obj      Object being checking
 * @arg     keys     Array of Strings to be keys of obj
 * @return  Boolean
 */
function complete(obj, keys) {
  return keys.every(key => {
    return obj.hasOwnProperty(key);
  });
}

/*
 * Sanitize input from users
 *
 * @arg     input   String being sanitized
 * @arg     fields  Array of keys to be sanitized
 * @return  null
 */
function sanitize(obj, fields) {
  // TODO: Add functionality
  if (!obj || !fields) {
    return;
  }

  fields.forEach(field => {
    if (obj[field] && typeof(obj[field]) === String) {
      // obj[field] = obj[field].replace(//g, '');
    }
  });
}

/*
 * Check if a string is valid JSON
 *
 * @arg     input    String being sanitized
 * @return  Boolean
 */
function isJSON(input) {
  try {
    JSON.parse(input);
    return true;
  } catch (e) {
    return false;
  }

  return true;
}

/*
 * Check if a string is valid JSON
 *
 * @arg     input    String being sanitized
 * @return  Boolean
 */
function sendEmail(to, subject, body, attachments, cb) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD
    }
  });

  transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: to,
    subject: subject,
    html: body,
    attachments: attachments
  }, (err, info) => {
    cb(err, info);
  });
}

/*
 * See if a request has the correct authorization
 *
 * @arg     req       Request to be checked
 * @return  Callback
 */
function authorize(req, params = {}) {
  return new Promise((resolve, reject) => {
    if (!req || !params) {
      return reject('Missing req or params');
    }

    if (!req.headers.authorization) {
      return reject('Missing necessary authorization');
    }

    let token = req.headers.authorization;

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err || !decoded.user_id) {
        return reject('Invalid token');
      }

      // Check if user has correct permissions in workspace
      if (params.hasOwnProperty('workspace_id')) {
        Workspace.findOne({'_id': params.workspace_id, 'deleted': false}).exec((err, workspace) => {
          if (err) {
            return reject('Error retrieving workspace: ' + err);
          }
          else if (!workspace) {
            return reject('Invalid workspace_id');
          }

          for (let i = 0; i < workspace.users.length; i++) {
            // user_id in users array
            if (workspace.users[i].account == decoded.user_id) {
              // Check if roles match if they were passed
              if (params.hasOwnProperty('roles')) {
                // See if there's an intersection
                if (params.roles.includes(workspace.users[i].role)) {
                  workspace.updateLastActivity(decoded.user_id, err => {
                    return resolve(decoded);
                  });
                  return;
                }
                else {
                  return reject('Insufficient permissions');
                }
              }
              else {
                workspace.updateLastActivity(decoded.user_id, err => {
                  return resolve(decoded);
                });
                return;
              }
            }
          }
          return reject('You are not a member of this workspace');
        });
      }
      else {
        return resolve(decoded);
      }
    });
  });
}

function getEmptyPromise() {
  return new Promise((resolve, reject) => {
    resolve();
  });
}

module.exports = {complete, sanitize, isJSON, sendEmail, authorize, getEmptyPromise};
