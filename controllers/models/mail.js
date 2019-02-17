const nodemailer = require('nodemailer');

const hrmove = {
  smtp: 'HRMOVE_SMTP',
  port: 'HRMOVE_PORT',
  pwd: 'HRMOVE_PWD',
  user: 'HRMOVE_USER',
  mail: 'HRMOVE_MAIL',
};

const skillsgarden = {
  smtp: 'SG_SMTP',
  port: 'SG_PORT',
  pwd: 'SG_PWD',
  user: 'SG_USER',
  mail: 'SG_MAIL',
};

const dummy = {
  smtp: 'smtp',
  port: '465',
  pwd: 'xxx',
  user: 'username',
  mail: 'mail',
};

const mailConfig = (id) => {
  switch (id) {
    case 'hrmove': return hrmove;
    case 'skillsgarden': return skillsgarden;
    default: return dummy;
  }
};

class Mail {
  constructor(company = 'dummy') {
    this.company = company;
    this.mail = mailConfig(company).mail;
    this.setTransporter(company);
  }

  getTransporter() {
    return this.transporter;
  }

  getCompany() {
    return this.company;
  }

  getMail() {
    return mailConfig(this.company).mail;
  }

  // sets a new company value and returns the corresponding mail transporter
  setCompany(company) {
    this.company = company;
    return this.transporter(this.company);
  }

  setTransporter(company) {
    const mc = mailConfig(company);
    const transporter = nodemailer.createTransport({
      host: process.env[mc.smtp],
      port: process.env[mc.port],
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env[mc.user],
        pass: process.env[mc.pwd],
      },
    });
    this.transporter = transporter;
    return transporter;
  }
}

module.exports = {
  Mail,
};
