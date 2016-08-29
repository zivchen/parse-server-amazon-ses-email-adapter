//require('babel-polyfill');

/*
const MailAdapter = require('parse-server/lib/Adapters/Email/MailAdapter');
const AmazonSES = require('amazon-ses-mailer');
const template = require('lodash.template');
const co = require('co');
const fs = require('fs');
const path = require('path');
*/

import { MailAdapter } from 'parse-server/lib/Adapters/Email/MailAdapter';
import AmazonSES from 'amazon-ses-mailer';
import template from 'lodash.template';
import co from 'co';
import fs from 'fs';
***REMOVED***

/**
 * MailAdapter implementation used by the Parse Server to send
 * password reset and email verification emails though AmazonSES
 * @class
 */
class AmazonSESAdapter extends MailAdapter {
  constructor(options = {}) {
    super(options);

    const {
      accessKeyId,
      secretAccessKey,
      region,
      fromAddress
***REMOVED*** = options;
    if (!accessKeyId || !secretAccessKey || !region || !fromAddress) {
      throw new Error('AmazonSESAdapter requires valid fromAddress, accessKeyId, secretAccessKey, region.');
***REMOVED***

    const {
      templates = {}
***REMOVED*** = options;
    ['passwordResetEmail', 'verificationEmail'].forEach((key) => {
      const {
        subject,
        pathPlainText,
        callback
  ***REMOVED*** = templates[key] || {***REMOVED***
      if (typeof subject !== 'string' || typeof pathPlainText !== 'string')
        throw new Error('AmazonSESAdapter templates are not properly configured.');

      if (callback && typeof callback !== 'function')
        throw new Error('AmazonSESAdapter template callback is not a function.');
***REMOVED***);

    this.ses = new AmazonSES(accessKeyId, secretAccessKey, region);
    this.fromAddress = fromAddress;
    this.templates = templates;

***REMOVED***

  /**
   * Method to send emails via AmazonSESAdapter
   *
   * @param {object} options, options object with the following parameters:
   * @param {string} options.subject, email's subject
   * @param {string} options.link, to reset password or verify email address
   * @param {object} options.user, the Parse.User object
   * @param {string} options.pathPlainText, path to plain-text version of email template
   * @param {string} options.pathHtml, path to html version of email template
   * @returns {promise}
   */
  _sendMail(options) {
    const loadEmailTemplate = this.loadEmailTemplate;
    let message = {},
      templateVars = {},
      pathPlainText, pathHtml;

    if (options.templateName) {
      const {
***REMOVED***
        subject,
***REMOVED***
***REMOVED***
***REMOVED***
  ***REMOVED*** = options;
      let template = this.templates[templateName];

      if (!template) throw new Error(`Could not find template with name ${templateName}`);
      if (!subject && !template.subject) throw new Error(`Cannot send email with template ${templateName} without a subject`);
      if (!recipient) throw new Error(`Cannot send email with template ${templateName} without a recipient`);

      pathPlainText = template.pathPlainText;
      pathHtml = template.pathHtml;

      templateVars = variables;

      message = {
        from: fromAddress || this.fromAddress,
        to: recipient,
        subject: subject || template.subject
  ***REMOVED***;
***REMOVED*** else {
      const {
***REMOVED***
***REMOVED***
***REMOVED***,
***REMOVED***
  ***REMOVED*** = options;
      const {
        callback
  ***REMOVED*** = templateConfig;
      let userVars;

      if (callback && typeof callback === 'function') {
***REMOVED***Vars = callback(user);
        // If custom user variables are not packaged in an object, ignore it
        const validUserVars = userVars && userVars.constructor && userVars.constructor.name === 'Object';
***REMOVED***Vars = validUserVars ? userVars : {***REMOVED***
  ***REMOVED***

      pathPlainText = templateConfig.pathPlainText;
      pathHtml = templateConfig.pathHtml;

      templateVars = Object.assign({
***REMOVED***
***REMOVED***
***REMOVED***name: user.get('username'),
        email: user.get('email')
  ***REMOVED***, userVars);

      message = {
        from: this.fromAddress,
        to: user.get('email'),
        subject: templateConfig.subject
  ***REMOVED***;
***REMOVED***

    return co(function*() {
      let plainTextEmail, htmlEmail, compiled;

      // Load plain-text version
      plainTextEmail = yield loadEmailTemplate(pathPlainText);
      plainTextEmail = plainTextEmail.toString('utf8');

      // Compile plain-text template
      compiled = template(plainTextEmail, {
        interpolate: /{{([\s\S]+?)}}/g
  ***REMOVED***);
      // Add processed text to the message object
      message.text = compiled(templateVars);

      // Load html version if available
      if (pathHtml) {
        htmlEmail = yield loadEmailTemplate(pathHtml);
        // Compile html template
        compiled = template(htmlEmail, {
          interpolate: /{{([\s\S]+?)}}/g
    ***REMOVED***);
        // Add processed HTML to the message object
        message.html = compiled(templateVars);
  ***REMOVED***

      return {
        from: this.fromAddress,
        to: [message.to],
        subject: message.subject,
        body: {
          text: message.text,
          html: message.html,
    ***REMOVED***,
  ***REMOVED***;

***REMOVED***).then(payload => {
      return new Promise(function(resolve, reject) {
        ses.send(payload, (error, data) => {
          if (error) reject(error);
          resolve(data);
    ***REMOVED***);
  ***REMOVED***);
***REMOVED***, error => {
      console.error(error);
***REMOVED***);
***REMOVED***

  /**
   * _sendMail wrapper to send an email with password reset link
   * @param {object} options, options object with the following parameters:
   * @param {string} options.link, to reset password or verify email address
   * @param {string} options.appName, the name of the parse-server app
   * @param {object} options.user, the Parse.User object
   * @returns {promise}
   */
  sendPasswordResetEmail({link, appName, user}) {
    return this._sendMail({
      link,
      appName,
      user,
      templateConfig: this.templates.passwordResetEmail
***REMOVED***);
***REMOVED***

  /**
   * _sendMail wrapper to send an email with an account verification link
   * @param {object} options, options object with the following parameters:
   * @param {string} options.link, to reset password or verify email address
   * @param {string} options.appName, the name of the parse-server app
   * @param {object} options.user, the Parse.User object
   * @returns {promise}
   */
  sendVerificationEmail({link, appName, user}) {
    return this._sendMail({
      link,
      appName,
      user,
      templateConfig: this.templates.verificationEmail
***REMOVED***);
***REMOVED***

  /**
   * _sendMail wrapper to send general purpose emails
   * @param {object} options, options object with the following parameters:
   * @param {object} options.templateName, name of template to be used
   * @param {object} options.subject, overrides the default value
   * @param {object} options.fromAddress, overrides the default from address
   * @param {object} options.recipient, email's recipient
   * @param {object} options.variables, an object whose property names represent
   *   template variables,vand whose values will replace the template variable
   *   placeholders
   * @returns {promise}
   */
  send({templateName, subject, fromAddress, recipient, variables = {}}) {
    return this._sendMail({
      templateName,
      subject,
      fromAddress,
      recipient,
      variables
***REMOVED***);
***REMOVED***

  /**
   * Simple Promise wrapper to asynchronously fetch the contents of a template.
   * @param {string} path
   * @returns {promise}
   */
  loadEmailTemplate(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) reject(err);
        resolve(data);
  ***REMOVED***);
***REMOVED***);
***REMOVED***

}

module.exports = AmazonSESAdapter;
