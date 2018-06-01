import React from 'react';
import { PropTypes } from 'prop-types';
import withLoader from 'components/withLoader';
import AdminDataContext from 'components/AdminDataContext';

import PageContent from './PageContent';

import { db } from '../../../firebase';

const Analysis = props => (
  <AdminDataContext.Consumer>
    {adminData => (adminData
      ? <PageContent {...props} adminData={adminData} />
      : null)}
  </AdminDataContext.Consumer>
);
Analysis.propTypes = {
  data: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectId: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

const dbFunction = db.onceGetProject;
export default withLoader(dbFunction, 'projectId')(Analysis);
