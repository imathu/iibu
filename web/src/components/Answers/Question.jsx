import React from 'react';
import { PropTypes } from 'prop-types';
import { getRoleCode } from 'utils';

const Question = ({
  question,
  roleId,
  gender,
  language,
}) => {
  const roleCode = getRoleCode(roleId, gender) || 'he';
  return (
    <div>
      {question.content[language.language][roleCode]}
    </div>
  );
};
Question.propTypes = {
  question: PropTypes.shape({}).isRequired,
  roleId: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  language: PropTypes.shape({}).isRequired,
};

export default Question;
