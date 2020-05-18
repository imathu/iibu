import React from 'react';
import { PropTypes } from 'prop-types';
import { Table, Button, Icon } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

import LanguageContext from 'components/LanguageContext';

import Question from './Question';
import Answer from './Answer';
import Remark from './Remark';

class ClientRow extends React.Component {
  static propTypes = {
    idx: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    feedbacker: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    questions: PropTypes.shape({}).isRequired,
    projectId: PropTypes.string.isRequired,
    client: PropTypes.shape({
      id: PropTypes.string,
      gender: PropTypes.string,
    }).isRequired,
    roleId: PropTypes.string.isRequired,
  }
  state = {
    remark: false,
  }
  toggleRemark = () => {
    this.setState({ remark: !this.state.remark });
  }
  render() {
    const {
      idx,
      feedbacker,
      questions,
      projectId,
      client,
      roleId,
      id,
    } = this.props;
    const { remark } = this.state;
    return (
      <React.Fragment>
        <Table.Row>
          <Table.Cell>
            {idx}
          </Table.Cell>
          <Table.Cell>
            <LanguageContext.Consumer>
              {language => (
                <Question
                  question={questions[id]}
                  roleId={roleId}
                  gender={client.gender}
                  language={language}
                />
              )}
            </LanguageContext.Consumer>
          </Table.Cell>
          <Table.Cell collapsing>
            <Answer
              feedbacker={feedbacker}
              scores={questions[id].scores}
              projectId={projectId}
              clientId={client.id}
              questionId={id}
            />
            <Button
              fluid
              size="mini"
              onClick={this.toggleRemark}
              icon
              labelPosition="right"
            >
              <Icon name={(remark) ? 'angle double up' : 'angle double down'} />
              <FormattedMessage
                id="feedback.remark"
                defaultMessage="Bemerkung hinzufügen?"
                values={{ what: 'react-intl' }}
              />
            </Button>
          </Table.Cell>
        </Table.Row>
        {remark && (
          <Remark
            id={idx}
            feedbackerId={feedbacker.id}
            projectId={projectId}
            clientId={client.id}
            questionId={id}
          />
        )}
      </React.Fragment>
    );
  }
}

export default ClientRow;
