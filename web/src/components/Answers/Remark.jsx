import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Table, TextArea, Message, Icon, Form, Header } from 'semantic-ui-react';

import { db } from '../../firebase';

// eslint-disable-next-line
function debounce(a,b,c){var d,e;return function(){function h(){d=null,c||(e=a.apply(f,g))}var f=this,g=arguments;return clearTimeout(d),d=setTimeout(h,b),c&&!d&&(e=a.apply(f,g)),e}}


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
    this.onChange = debounce(this.onChange, 500);
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
        remark: snapshot.val().remark || '',
      }));
    });
  }
  onChange = debounce((remark) => {
    db.doUpdateRemark(
      this.props.projectId,
      this.props.feedbackerId,
      this.props.clientId,
      this.props.questionId,
      remark,
    );
    this.setState({ saving: false });
  }, 100);
  save = (e, data) => {
    this.setState({ saving: true, remark: data.value });
    this.onChange(data.value);
  }
  render() {
    const { remark, saving } = this.state;
    const { id } = this.props;
    return (
      <Table.Row>
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
      </Table.Row>
    );
  }
}

export default Remark;

