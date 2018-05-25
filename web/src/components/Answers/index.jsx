import React from 'react';
import { PropTypes } from 'prop-types';
import { Loader } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as routes from 'constants/routes';

import AnswersList from './AnswersList';

import './Answers.css';

class Answers extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        clientId: PropTypes.string,
        feedbackerId: PropTypes.string.isRequired,
        projectId: PropTypes.string,
      }),
    }).isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }
  componentDidMount = () => {
    const { projectId, feedbackerId } = this.props.match.params;
    const API = `/api/v1/${projectId}/answers/${feedbackerId}`;
    fetch(API)
      .then(response => response.json())
      .then((data) => {
        if (!data.err) {
          this.setState({ data });
        } else {
          console.log('error', data.err); // eslint-disable-line no-console
          this.props.history.push(routes.LANDING);
        }
      }).catch((e) => {
        console.log('error', e); // eslint-disable-line no-console
        this.props.history.push(routes.LANDING);
      });
  }
  render() {
    const { data } = this.state;
    const { projectId, feedbackerId } = this.props.match.params;
    return (
      <div id="answers-content">
        {(data)
          ? <AnswersList data={data} projectId={projectId} feedbackerId={feedbackerId} />
          : <Loader active inline="centered" />
        }
      </div>
    );
  }
}

export default withRouter(Answers);
