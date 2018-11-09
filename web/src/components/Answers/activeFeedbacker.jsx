import React from 'react';
import { Segment, Header, Loader } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

import { withRouter } from 'react-router-dom';

import { db } from '../../firebase';

const activFeedbacker = (Component) => {
  class ActivFeedbacker extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        feedbackerNotActive: false,
        loading: true,
      };
    }
    componentDidMount() {
      const { projectId, feedbackerId } = this.props.match.params;
      db.getFeedbackerActiveFlag(projectId, feedbackerId).on('value', (snapshot) => {
        this.setState(() => ({ feedbackerNotActive: snapshot.val(), loading: false }));
      });
    }
    render() {
      const { feedbackerNotActive, loading } = this.state;
      if (loading) {
        return <Loader />;
      }
      return (
        (!feedbackerNotActive
          ? <Component {...this.props} />
          :
          <Segment
            style={{ margin: '10px', textAlign: 'center' }}
          >
            <Header as="h2">
              <FormattedMessage
                id="feedback.finishedHeader"
                defaultMessage="Erfolgreich abgeschlossen"
                values={{ what: 'react-intl' }}
              />
            </Header>
            <FormattedMessage
              id="feedback.finishedContent"
              defaultMessage="herzlichen Dank für Ihre Teilnahme"
              values={{ what: 'react-intl' }}
            />
          </Segment>
        )
      );
    }
  }
  return withRouter(ActivFeedbacker);
};

export default activFeedbacker;
