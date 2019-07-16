import React from 'react'
import { Text } from 'react-raphael';

import { getElapsedTime } from '../../game/utilities';

const getTimerText = lengthMs => {
  const lengthSecs = Math.floor(lengthMs / 1000);
  const hours = Math.floor((lengthSecs / 60) / 60);
  const minutes = Math.floor((lengthSecs / 60) - (hours * 60));
  const seconds = (lengthSecs - ((minutes * 60) + (hours * 60 * 60)));
  const formatTimeUnit = unit => `${unit === 0 ? '00' : ''}${unit > 0 && unit <= 9 ? '0' : ''}${unit > 0 ? unit : ''}`

  return `${hours > 0 ? `${formatTimeUnit(hours)}:` : ''}${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`;
}

class Timer extends React.Component {
  componentDidMount() {
    this.interval = setInterval(this.forceUpdate.bind(this), this.props.updateInterval || 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { active, time, startedAt, stoppedAt } = this.props;
    const elapsed = getElapsedTime(time, startedAt, stoppedAt);

    return (
      <Text text={getTimerText(elapsed)}
        x={480} y={28}
        attr={{class: 'timer'}}
        hide={!active}></Text>
    );
  }
}

export default Timer;
