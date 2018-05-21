import React from 'react';
import { PropTypes } from 'prop-types';
import { Loader, Divider } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as routes from 'constants/routes';

import Client from './Client';

import './Answers.css';

const WithData = (props) => {
  const { data } = props;
  return (
    <div>
      {Object.keys(data.feedbacker.clients).map(id => (
        <div>
          <Client
            key={id}
            contexts={data.contexts}
            roles={data.roles}
            questions={data.questions}
            client={data.clients[id]}
            feedbacker={data.feedbacker}
          />
          <Divider />
        </div>
      ))}
    </div>
  );
};
WithData.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

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
      });
  }
  render() {
    const { data } = this.state;
    return (
      <div id="answers-content">
        {(data)
          ? <WithData data={data} />
          : <Loader active inline="centered" />
        }
      </div>
    );
  }
}

export default withRouter(Answers);
