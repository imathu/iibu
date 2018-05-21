import React from 'react';
import { PropTypes } from 'prop-types';

const Question = ({ question }) => (
  <div>
    {question.content.de.he}
  </div>
);
Question.propTypes = {
  question: PropTypes.shape({}).isRequired,
};

export default Question;
