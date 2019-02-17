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
    case hrmove: return hrmove;
    case skillsgarden: return skillsgarden;
    default: return dummy;
  }
};

module.exports = {
  mailConfig,
};

