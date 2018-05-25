import React from 'react';
import { PropTypes } from 'prop-types';
import withLoader from 'components/withLoader';
import { Header } from 'semantic-ui-react';
import AdminDataContext from 'components/AdminDataContext';

import { db } from '../../../firebase';

const PageContent = ({ data, adminData }) => {
  return (
    <div>
      <Header floated="left" as="h1">Analyse</Header>
    </div>
  );
};
PageContent.propTypes = {
  data: PropTypes.shape({}).isRequired,
  adminData: PropTypes.shape({}).isRequired,
};

class Analysis extends React.Component {
  static propTypes = {
    data: PropTypes.shape({}).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }),
    }).isRequired,
  }
  render() {
    const { data } = this.props;
    return (
      <AdminDataContext.Consumer>
        {adminData => (adminData
          ? <PageContent {...this.props} adminData={adminData} />
          : null)}
      </AdminDataContext.Consumer>
    )
  }
};

const dbFunction = db.onceGetProject;
export default withLoader(dbFunction, 'projectId')(Analysis);
