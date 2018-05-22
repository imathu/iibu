import React from 'react';
import PropTypes from 'prop-types';

import { db } from '../../firebase';

class Menu extends React.Component {
  static propTypes = {
    feedbacker: PropTypes.shape({}).isRequired,
    projectId: PropTypes.string.isRequired,
    client: PropTypes.shape({}).isRequired,
    numQuestions: PropTypes.number.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      answers: 0,
    };
  }
  componentDidMount = () => {
    const { feedbacker, projectId, client } = this.props;
    db.numAnswers(projectId, feedbacker.id, client.id).on('value', (snapshot) => {
      this.setState(() => ({ answers: snapshot.numChildren() }));
    });
  }
  render() {
    const { client, numQuestions } = this.props;
    const { answers } = this.state;
    return (
      <div>{client.name} {client.firstname}: <b>{answers} / {numQuestions}</b></div>
    );
  }
}

export default Menu;
