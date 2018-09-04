import debugLogger from 'debug-logger';
import { sendError } from '../../../common/route-utils';
import config from '../../../config';
import auth from '../../auth';
import permissions from '../../auth/permissions';
import { sendEmail } from '../../users/tippiq_id';

const debug = debugLogger('tippiq-hood:contact:actions:send-form');

/**
 * Response handler for sending forms
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  auth
    .validatePermissionsAndSendUnauthorized(req, res, permissions.SEND_CONTACT_FORM_EMAIL)
    .then(() => (
      {
        from: config.fromEmailAddress,
        to: config.contactFormAddress,
        templateName: 'contact-form',
        subject: `[Tippiq contact] ${req.body.subject}`,
        templateData: {
          frontendBaseURL: config.frontendBaseUrl,
          name: req.body.name,
          body: req.body.message,
          email: req.body.email,
          subject: req.body.subject,
        },
      })
    )
    .then(emailJson => sendEmail(emailJson))
    .then(() => res.status(200).json(
      {
        success: true,
        message: 'Message sent.',
      })
    )
    .catch(e => {
      debug.warn(`Error send contact form: ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}
