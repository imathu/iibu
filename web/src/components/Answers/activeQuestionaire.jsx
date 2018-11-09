import React from 'react';
import { Segment, Header, Loader } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

import { db } from '../../firebase';

const activeQuestionaire = (Component) => {
  class ActiveQuestionaire extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        activeFlag: false,
        loading: true,
      };
    }
    componentDidMount() {
      const { projectId } = this.props.match.params;
      db.getActiveFlag(projectId).on('value', (snapshot) => {
        this.setState(() => ({ activeFlag: snapshot.val(), loading: false }));
      });
    }
    render() {
      const { activeFlag, loading } = this.state;
      if (loading) {
        return <Loader />;
      }
      return (
        (activeFlag
          ? <Component {...this.props} />
          :
          <Segment
            style={{ margin: '10px', textAlign: 'center' }}
          >
            <Header as="h2">
              <FormattedMessage
                id="feedback.closedHeader"
                defaultMessage="Der Feedbackbogen ist nicht aktiv"
                values={{ what: 'react-intl' }}
              />
            </Header>
            <FormattedMessage
              id="feedback.closedContent"
              defaultMessage="Für Fragen wenden Sie sich an den Organisator"
              values={{ what: 'react-intl' }}
            />
          </Segment>
        )
      );
    }
  }
  return withRouter(ActiveQuestionaire);
};

export default activeQuestionaire;
