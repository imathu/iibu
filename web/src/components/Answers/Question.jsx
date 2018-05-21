import React from 'react';
import { PropTypes } from 'prop-types';
import { getLanguage } from 'utils/language';
import { getRoleCode } from 'utils';

const Question = ({ question, roleId, gender }) => {
  const lang = getLanguage();
  const roleCode = getRoleCode(roleId, gender) || 'he';
  return (
    <div>
      {question.content[lang][roleCode]}
    </div>
  );
};
Question.propTypes = {
  question: PropTypes.shape({}).isRequired,
  roleId: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
};

export default Question;
