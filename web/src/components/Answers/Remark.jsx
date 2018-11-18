import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Table, TextArea, Message, Icon, Form, Header } from 'semantic-ui-react';
import { debounce } from 'throttle-debounce';

import { db } from '../../firebase';

class Remark extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    projectId: PropTypes.string.isRequired,
    feedbackerId: PropTypes.string.isRequired,
    questionId: PropTypes.string.isRequired,
    clientId: PropTypes.string.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      remark: '',
    };
    this.onChangeDebounced = debounce(300, this.onChange);
  }
  componentDidMount = () => {
    const {
      projectId,
      clientId,
      questionId,
      feedbackerId,
    } = this.props;
    db.getRemark(projectId, feedbackerId, clientId, questionId).on('value', (snapshot) => {
      this.setState(() => ({
        remark: (snapshot.val()) ? snapshot.val().remark || '' : null,
      }));
    });
  }
  onChange = (remark) => {
    db.doUpdateRemark(
      this.props.projectId,
      this.props.feedbackerId,
      this.props.clientId,
      this.props.questionId,
      remark,
    );
    this.setState({ saving: false });
  }
  save = (e, data) => {
    this.setState({ saving: true, remark: data.value });
    this.onChangeDebounced(data.value);
  }
  render() {
    const { remark, saving } = this.state;
    const { id } = this.props;
    return (
      <Table.Row>
        { (remark !== null)
        ?
          <Table.Cell colSpan="3">
            <Form>
              <Header as="h3" style={{ textAlign: 'center' }}>
                <FormattedMessage
                  id="feedback.remarkDisclaimer"
                  defaultMessage="Dieser Kommentar wird 1:1 in die Auswertung übernommen"
                  values={{ what: 'react-intl' }}
                />
              </Header>
              <Form.Field
                style={{ backgroundColor: '#FEF9E7' }}
                id="remark"
                control={TextArea}
                placeholder={`Bemerkung zu Frage ${id}`}
                value={remark}
                onChange={this.save}
              />
            </Form>
            {saving &&
              <Message icon>
                <Icon name="circle notched" loading />
                <Message.Content>
                  <Message.Header>
                    <FormattedMessage
                      id="feedback.savingHeader"
                      defaultMessage="Ein kurzer Moment"
                      values={{ what: 'react-intl' }}
                    />
                  </Message.Header>
                  <FormattedMessage
                    id="feedback.savingContent"
                    defaultMessage="Ihre Daten werden gespeichert"
                    values={{ what: 'react-intl' }}
                  />
                </Message.Content>
              </Message>
            }
          </Table.Cell>
        :
          <Table.Cell colSpan="3">
            <FormattedMessage
              id="feedback.noRemark"
              defaultMessage="Bitte beantworten Sie zuerst die Frage"
              values={{ what: 'react-intl' }}
            />
          </Table.Cell>
        }

      </Table.Row>
    );
  }
}

export default Remark;

