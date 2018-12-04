import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Loader, Radio, Image, Label } from 'semantic-ui-react';
import { LOGO } from 'constants/company';
import withAuthorization from 'components/withAuthorization';

import { db } from '../../firebase';

const getLogo = company => (
  LOGO[company] || null
);

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

  toggleState = (id) => {
    const s = !this.state.data[id].active;
    db.doSetProjectState(id, s).then(() => {
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
              <Table.HeaderCell>Firma</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!!data && Object.keys(data).map(id => (
              <Table.Row key={id}>
                <Table.Cell>
                  { data[id].active &&
                    <Label color="green" ribbon>
                      AKTIV
                    </Label>
                  }
                  {data[id].name}
                </Table.Cell>
                <Table.Cell collapsing>
                  {(data[id].company)
                    ?
                      <Image size="tiny" src={getLogo(data[id].company)} />
                    :
                      <p>n/a</p>
                  }
                </Table.Cell>
                <Table.Cell collapsing>
                  <Radio
                    toggle
                    checked={!!data[id].active}
                    onClick={() => this.toggleState(id)}
                  />
                </Table.Cell>
                <Table.Cell collapsing textAlign="center">
                  <a href={`/project/${id}/fragen`}>Analyse</a>
                </Table.Cell>
                <Table.Cell collapsing textAlign="center">
                  <a href={`/projects/edit?projectId=${id}`}>Details</a>
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
