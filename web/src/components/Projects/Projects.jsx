import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Loader } from 'semantic-ui-react';
import withAuthorization from 'components/withAuthorization';

import { db } from '../../firebase';

class Projects extends React.Component {
  state = {
    data: null,
  }

  componentDidMount() {
    this.getProjects();
  }

  getProjects = () => {
    db.onceGetProjects().then(((snapshot) => {
      this.setState(() => ({ data: snapshot.val() }));
    }));
  }

  deleteProject = (id) => {
    db.doRemoveProject(id).then(() => {
      this.getProjects();
    });
  }
  render() {
    const { data } = this.state;
    return (data) ? (
      <div className="admin-content" style={{ width: '60%' }}>
        <Button as={Link} to="projects/edit">Neues Projekt</Button>
        <Table celled padded size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Projekt</Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell />
              <Table.HeaderCell collapsing />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!!data && Object.keys(data).map(id => (
              <Table.Row key={id}>
                <Table.Cell>{data[id].name}</Table.Cell>
                <Table.Cell collapsing textAlign="center">
                  <a href={`/project/${id}/fragen`}>Analyse</a>
                </Table.Cell>
                <Table.Cell collapsing textAlign="center">
                  <a href={`/projects/edit?projectId=${id}`}>Details</a>
                </Table.Cell>
                <Table.Cell collapsing textAlign="center">
                  <Button
                    size="tiny"
                    onClick={() => this.deleteProject(id)}
                  >
                    Löschen
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    ) :
      <Loader active inline="centered" />;
  }
}

const authCondition = (authUser, admin) => (!!authUser && admin);
export default withAuthorization(authCondition)(Projects);
