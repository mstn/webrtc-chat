import React from 'react';

import T from 'prop-types';

class Countdown extends React.Component {
  state = {
    countdown: this.props.countdown
  }
  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.countdown > 0) {
        this.setState({
          countdown: this.state.countdown - 1
        });
      } else {
        this.stopCountdown();
        this.redirectToExternalUrl();
        this.props.onDone();
      }
    }, 1000);
  }
  componentWillUnmount() {
    this.stopCountdown();
  }
  render() {
    const { countdown } = this.state;
    return (
      <React.Fragment>
        Countdown: -{countdown}
      </React.Fragment>
    );
  }
  stopCountdown = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  redirectToExternalUrl = () => {
    // TODO this is not idea since window could not be available on server
    window.open(this.props.link, '_blank');
  }
}

Countdown.propTypes = {
  link: T.string.isRequired,
  countdown: T.number.isRequired,
  onDone: T.func.isRequired
};

export default Countdown;