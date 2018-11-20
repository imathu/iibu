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
  const q = question.content[language.language];
  const questionString = (q) ? q[roleCode] : question.content.de[roleCode];
  return (
    <div>
      {questionString}
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
