import React from 'react';

import T from 'prop-types';

import './Bubble.css';

import classnames from 'classnames';

const Bubble = (props) => {
  return (
    <div className={props.highlight ? 'highlight' : ''} >
      <div className={classnames(['talk-bubble', 'tri-right', props.remote ? 'left-top' : 'right-top'])}>
        <div className="talktext">
          <p className={props.think ? 'isThinking' : ''}>{props.text}</p>
        </div>
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
