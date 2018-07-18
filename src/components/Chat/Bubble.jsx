import React from 'react';

import T from 'prop-types';

import './Bubble.css';

import classnames from 'classnames';

const Bubble = (props) => {
  return (
    <div className={classnames(['talk-bubble', 'tri-right', props.remote ? 'right-top' : 'left-top'])}>
      <div className="talktext">
        <p className={props.think ? 'isThinking' : ''}>{props.text}</p>
      </div>
    </div>
  );
}

Bubble.propTypes = {
  think: T.bool,
  remote: T.bool,
  text: T.string.isRequired,
};

export default Bubble;
