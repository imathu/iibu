import React from 'react';
import { PropTypes } from 'prop-types';

import activeQuestionaire from './activeQuestionaire';
import activeFeedbacker from './activeFeedbacker';
import AnswersList from './AnswersList';

const Content = (props) => {
  const { user, projectId, feedbackerId } = props;
  return (
    <div id="answers-content">
      <AnswersList
        user={user}
        projectId={projectId}
        feedbackerId={feedbackerId}
      />
    </div>
  );
};
Content.propTypes = {
  projectId: PropTypes.string.isRequired,
  feedbackerId: PropTypes.string.isRequired,
  user: PropTypes.shape({}),
};
Content.defaultProps = {
  user: null,
};

export default activeQuestionaire(activeFeedbacker(Content));
