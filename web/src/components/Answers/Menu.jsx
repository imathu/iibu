import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

const Menu = ({ client, numQuestions, numAnswers }) => (
  <React.Fragment>
    <div>{client.name} {client.firstname}: <b>{numAnswers} / {numQuestions}</b>
      {(numAnswers === numQuestions)
          ? <Icon color="green" name="checkmark" style={{ paddingLeft: '8px' }} />
          : <Icon color="red" name="exclamation circle" style={{ paddingLeft: '8px' }} />
      }
    </div>
  </React.Fragment>
);
Menu.propTypes = {
  client: PropTypes.shape({}).isRequired,
  numQuestions: PropTypes.number.isRequired,
  numAnswers: PropTypes.number.isRequired,
};

export default Menu;
