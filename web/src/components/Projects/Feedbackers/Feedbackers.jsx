import React from 'react';
import { PropTypes } from 'prop-types';
import AdminDataContext from 'components/AdminDataContext';
import { Table, Header, Checkbox, Button } from 'semantic-ui-react';

import { db } from '../../../firebase';

import FeedbackerRow from './FeedbackerRow';
import MailModal from './MailModal';

function toggle(array, id) {
  if (array.indexOf(id) === -1) {
    array.push(id);
    return array;
  }
  return array.filter(i => i !== id);
}

class Feedbackers extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string,
      }),
    }).isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      selected: [],
      modal: false,
    };
  }
  componentDidMount() {
    const p = this.props.match.params.projectId;
    db.onceGetFeedbackers(p).then((snapshot) => {
      this.setState(() => ({ data: snapshot.val() }));
    });
  }
  toggleAll = () => {
    const { data, selected } = this.state;
    const allSelected = (data && (Object.keys(data).length === selected.length));
    this.setState(() => ({ selected: (!allSelected) ? Object.keys(this.state.data) : [] }));
  }
  toggleSelect = (id) => {
    this.setState(() => ({ selected: toggle(this.state.selected, id) }));
  }
  open = () => {
    this.setState(() => ({ modal: true }));
  }
  close = () => {
    this.setState(() => ({ modal: false, selected: [] }));
  }
  render() {
    const {
      data,
      selected,
      modal,
    } = this.state;
    const { projectId } = this.props.match.params;
    const allSelected = (!!data && (Object.keys(data).length === selected.length));
    return (
      <div>
        <Header floated="left" as="h1">Feedbackgeber</Header>
        {!!data && (
          <AdminDataContext.Consumer>
            {adminData => (adminData && adminData.project && (
              <MailModal
                modal={modal}
                close={this.close}
                data={data}
                selected={selected}
                project={adminData.project}
                projectId={projectId}
              />
           ))}
          </AdminDataContext.Consumer>
        )}
        <Button
          floated="right"
          onClick={this.open}
          disabled={selected.length <= 0}
        >Mail
        </Button>
        <Table celled padded size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.HeaderCell>Mail</Table.HeaderCell>
              <Table.HeaderCell>Geschlecht</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Abgeschlossen</Table.HeaderCell>
              <Table.HeaderCell>Details</Table.HeaderCell>
              <Table.HeaderCell>
                <Checkbox
                  checked={!!allSelected}
                  onChange={this.toggleAll}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!!data && Object.keys(data).map(id => (
              <AdminDataContext.Consumer key={id}>
                {adminData => (adminData && adminData.project
                  ? <FeedbackerRow
                    feedbackerId={id}
                    selected={selected}
                    adminData={adminData}
                    projectId={projectId}
                    toggleSelect={this.toggleSelect}
                  />
                  : null)}
              </AdminDataContext.Consumer>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default Feedbackers;

// const authCondition = authUser => !!authUser;
// export default withAuthorization(authCondition)(Feedbackers);
