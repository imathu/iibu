import React from 'react';
import { Loader } from 'semantic-ui-react';
import { PropTypes } from 'prop-types';

const withLoader = (func, param = null) => (Component) => {
  class WithLoader extends React.Component {
    static propTypes = {
      match: PropTypes.shape({
        params: PropTypes.shape({}),
      }),
    }
    static defaultProps = {
      match: {},
    }
    constructor(props) {
      super(props);
      this.state = {
        data: null,
      };
    }
    componentDidMount() {
      if (this.props) {
        const p = (param) ? this.props.match.params[param] : null;
        func(p).then((snapshot) => {
          this.setState(() => ({ data: snapshot.val() }));
        });
      }
    }
    render() {
      const { data } = this.state;
      return (
        <div>
          {(data) ? <Component data={data} /> : <Loader active inline="centered" />}
        </div>
      );
    }
  }
  return WithLoader;
};

export default withLoader;
