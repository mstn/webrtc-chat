import React from 'react';

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

export default Bubble;
