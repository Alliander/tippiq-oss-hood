/**
 * @module email/render-email-template
 */

import debugLogger from 'debug-logger';
import path from 'path';
import { EmailTemplate } from 'email-templates';
import ExtendableError from 'es6-error';
import config from '../../config';

const debug = debugLogger('tippiq-id:email:render');
const templateDir = path.join(__dirname, 'templates');

/**
 * Error thrown when an email template cannot be rendered
 */
export class RenderError extends ExtendableError {
}

/**
 * Render the named template using the given data
 * @param {Object} data To render the template with
 * @param {string} templateName Name of the subdirectory in this modules template directory
 * @returns {Promise<EmailTemplate>} Prerendered email template
 */
export function renderEmailTemplate(data, templateName) {
  const templatePath = path.join(templateDir, templateName);
  const templateData = {
    ...data.templateData,
    frontendTippiqPlacesBaseUrl: config.tippiqPlacesBaseUrl,
    frontendTippiqIdBaseUrl: config.tippiqIdBaseUrl,
  };
  return new EmailTemplate(templatePath)
    .render(templateData)
    .catch((e) => {
      debug.trace(e);
      throw new RenderError(`Unable to render template ${templatePath}`);
    });
}
