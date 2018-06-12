import React from 'react';
import { PropTypes } from 'prop-types';
import { Segment, Table } from 'semantic-ui-react';

import { getAllContextIds } from 'utils/question';

import ClientContextBar from './ClientContextBar';
import ClientContextRadar from './ClientContextRadar';

class ClientData extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      questions: PropTypes.shape({}),
    }).isRequired,
    adminData: PropTypes.shape({
      contexts: PropTypes.shape({}),
    }).isRequired,
    radar: PropTypes.bool.isRequired,
    bar: PropTypes.bool.isRequired,
    line: PropTypes.bool.isRequired,
    clientId: PropTypes.string.isRequired,
    onRef: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.bars = {}; // use this for references to child refs
    this.radar = {}; // use this for references to child refs
    this.lines = {}; // use this for references to child refs
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  render() {
    const {
      bar,
      line,
      data,
      radar,
    } = this.props;
    return (
      <React.Fragment>
        {bar && (

            <Table>
              <Table.Body>
                {getAllContextIds(data.questions).map(contextId => (
                  <ClientContextBar
                    {...this.props}
                    key={contextId}
                    contextId={contextId}
                    line={false}
                    onRef={(ref) => { this.bars[contextId] = ref; }}
                  />
                ))}
              </Table.Body>
            </Table>
          
        )}
        {line && (
          <Segment>
            <Table>
              <Table.Body>
                {getAllContextIds(data.questions).map(contextId => (
                  <ClientContextBar
                    {...this.props}
                    key={contextId}
                    contextId={contextId}
                    line
                    onRef={(ref) => { this.lines[contextId] = ref; }}
                  />
                ))}
              </Table.Body>
            </Table>
          </Segment>
        )}
        {radar && (
          <Segment>
            <Table>
              <Table.Body>
                <ClientContextRadar
                  {...this.props}
                  onRef={(ref) => { this.radar = ref; }}
                />
              </Table.Body>
            </Table>
          </Segment>
        )}
      </React.Fragment>
    );
  }
}

export default ClientData;
