import React from 'react';
import { PropTypes } from 'prop-types';
import { Segment } from 'semantic-ui-react';

import { getAllContextIds } from 'utils/question';

import ClientContextBar from './ClientContextBar';
import ClientContextRadar from './ClientContextRadar';
import ClientContextBarPerQuestion from './ClientContextBarPerQuestion';

class ClientData extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      questions: PropTypes.shape({}),
    }).isRequired,
    adminData: PropTypes.shape({
      contexts: PropTypes.shape({}),
    }).isRequired,
    radar: PropTypes.bool.isRequired,
    barPerContext: PropTypes.bool.isRequired,
    barPerQuestion: PropTypes.bool.isRequired,
    line: PropTypes.bool.isRequired,
    clientId: PropTypes.string.isRequired,
    onRef: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
  }
  constructor(props) {
    super(props);
    this.barsPerContext = {};
    this.barsPerQuestion = {};
    this.radar = {};
    this.lines = {};
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  render() {
    const {
      barPerContext,
      barPerQuestion,
      line,
      data,
      radar,
      height,
    } = this.props;
    return (
      <React.Fragment>
        {barPerContext && (
          <Segment>
            {getAllContextIds(data.questions).map(contextId => (
              <ClientContextBar
                {...this.props}
                key={contextId}
                contextId={contextId}
                line={false}
                onRef={(ref) => { this.barsPerContext[contextId] = ref; }}
              />
            ))}
          </Segment>
        )}
        {barPerQuestion && (
          <Segment>
            {getAllContextIds(data.questions).map(contextId => (
              <ClientContextBarPerQuestion
                {...this.props}
                key={contextId}
                height={height}
                contextId={contextId}
                onRef={(ref) => { this.barsPerQuestion[contextId] = ref; }}
              />
            ))}
          </Segment>
        )}
        {line && (
          <Segment>
            {getAllContextIds(data.questions).map(contextId => (
              <ClientContextBar
                {...this.props}
                key={contextId}
                contextId={contextId}
                height={height}
                line
                onRef={(ref) => { this.lines[contextId] = ref; }}
              />
            ))}
          </Segment>
        )}
        {radar && (
          <Segment>
            <ClientContextRadar
              {...this.props}
              onRef={(ref) => { this.radar = ref; }}
            />
          </Segment>
        )}
      </React.Fragment>
    );
  }
}

export default ClientData;
