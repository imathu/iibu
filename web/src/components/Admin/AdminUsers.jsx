import React from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Table, Button } from 'semantic-ui-react';

import * as routes from 'constants/routes';

import { db, firebase } from '../../firebase';

class AdminUsers extends React.Component {
  static propTypes = {
    users: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({}).isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      admins: null,
    };
  }
  componentDidMount() {
    db.onceGetAdminUsers().then((snapshot) => {
      const users = Object.keys(this.props.users).map(key => ({
        id: key,
        ...this.props.users[key],
      }));
      const admins = users.filter(user => snapshot.val()[user.id]);
      this.setState(() => ({ admins }));
    });
  }
  onAdminRemove = (event, id) => {
    const {
      history,
    } = this.props;

    db.doRemoveAdmin(id)
      .then(() => {
        history.push(routes.ADMIN_USERS);
      })
      .catch((error) => {
        console.log('error', error); // eslint-disable-line no-console
      });
    event.preventDefault();
  }


  render() {
    const { admins } = this.state;
    return (
      <div>
        <h1>Administratoren</h1>
        <Table celled padded size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.HeaderCell>Mail</Table.HeaderCell>
              <Table.HeaderCell>Benutzername</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!!admins && admins.map(admin => (
              <Table.Row key={admin.id}>
                <Table.Cell>{admin.id}</Table.Cell>
                <Table.Cell>{admin.email}</Table.Cell>
                <Table.Cell>{admin.username}</Table.Cell>
                <Table.Cell><Button size="tiny" onClick={ev => this.onAdminRemove(ev, admin.id)}>remove</Button></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default withRouter(AdminUsers);
