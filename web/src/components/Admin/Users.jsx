import React from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Table, Button } from 'semantic-ui-react';
import withLoader from 'components/withLoader';

import * as routes from 'constants/routes';
import AdminUsers from './AdminUsers';

import { db } from '../../firebase';

class Users extends React.Component {
  static propTypes = {
    data: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({}).isRequired,
  };
  onAdminAdd = (event, id) => {
    const {
      history,
    } = this.props;

    db.doCreateAdmin(id)
      .then(() => {
        history.push(routes.ADMIN_USERS);
      })
      .catch((error) => {
        console.log('error', error);
      });
    event.preventDefault();
  }
  onUserRemove = (event, id) => {
    const {
      history,
    } = this.props;

    db.doRemoveUser(id)
      .then(() => {
        db.doRemoveAdmin(id).then(() => history.push(routes.ADMIN_USERS));
      })
      .catch((error) => {
        console.log('error', error);
      });
    event.preventDefault();
  }
  render() {
    const { data } = this.props;
    return (
      <div>
        <AdminUsers users={data} />
        <hr />
        <h1>Benutzer</h1>
        <Table celled padded size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.HeaderCell>Mail</Table.HeaderCell>
              <Table.HeaderCell>Benutzername</Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!!data && Object.keys(data).map(id => (
              <Table.Row key={id}>
                <Table.Cell>{id}</Table.Cell>
                <Table.Cell>{data[id].email}</Table.Cell>
                <Table.Cell>{data[id].username}</Table.Cell>
                <Table.Cell><Button size="tiny" onClick={ev => this.onAdminAdd(ev, id)}>add to admin</Button></Table.Cell>
                <Table.Cell><Button size="tiny" onClick={ev => this.onUserRemove(ev, id)}>remove</Button></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

const dbFunction = db.onceGetUsers;
export default withLoader(dbFunction)(withRouter(Users));
