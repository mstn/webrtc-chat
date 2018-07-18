import React from 'react';

import './Bubble.css';

import classnames from 'classnames';

const Bubble = (props) => {
  return (
    <div className={classnames(['talk-bubble', 'tri-right', props.remote ? 'right-top' : 'left-top'])}>
      <div className="talktext">
        <p>{props.text}</p>
      </div>
    </div>
  );
}

export default Bubble;
