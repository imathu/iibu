import React from 'react';
import { PropTypes } from 'prop-types';
import { Menu, Button, Icon } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

import { db } from '../../firebase';

class Footer extends React.Component {
  static propTypes = {
    totalAnswers: PropTypes.number.isRequired,
    numQuestions: PropTypes.number.isRequired,
    projectId: PropTypes.string.isRequired,
    feedbackerId: PropTypes.string.isRequired,
    end: PropTypes.bool.isRequired,
  }
  close = () => {
    db.doFinishQuestionaire(this.props.projectId, this.props.feedbackerId, true);
  }
  render() {
    const { totalAnswers, numQuestions, end } = this.props;
    return (
      <Menu fixed="bottom" style={{ backgroundColor: 'lightgray' }}>
        <Menu.Menu position="right">
          <Menu.Item>
            <FormattedMessage
              id="feedback.finishState"
              defaultMessage="Sie haben {totalAnswers} von {numQuestions} beantwortet"
              values={{
                totalAnswers,
                numQuestions,
                what: 'react-intl',
               }}
            />
          </Menu.Item>
          <Menu.Item>
            <Button
              disabled={!end}
              color="green"
              style={{ margin: '5px' }}
              onClick={this.close}
            >
              <Icon name="checkmark" />
              <FormattedMessage
                id="feedback.complete"
                defaultMessage="Abschliessen"
                values={{ what: 'react-intl' }}
              />
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Footer;
