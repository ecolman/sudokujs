import React, { useEffect, useState } from 'react'
import { Text } from 'react-raphael';

import './styles.less';

function getTimerText(lengthMs) {
  const lengthSecs = Math.floor(lengthMs / 1000);
  const hours = Math.floor((lengthSecs / 60) / 60);
  const minutes = Math.floor((lengthSecs / 60) - (hours * 60));
  const seconds = (lengthSecs - ((minutes * 60) + (hours * 60 * 60)));
  const formatTimeUnit = unit => `${unit === 0 ? '00' : ''}${unit > 0 && unit <= 9 ? '0' : ''}${unit > 0 ? unit : ''}`

  return `${hours > 0 ? `${formatTimeUnit(hours)}:` : ''}${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`;
}

function Timer(props) {
  const [seconds, setSeconds] = useState(0);
  const updateInterval = props.updateInterval || 1000;

  // watches for active/paused changes and starts interval to update state every second
  useEffect(() => {
    if (props.active && !props.paused) {
      let interval = setInterval(() => setSeconds(seconds => seconds + 1), updateInterval);

      return () => clearInterval(interval);
    }
  }, [props.active, props.paused]);

  // when time changes, reset state
  useEffect(() => {
    setSeconds(0);
  }, [props.time])

  return (
    <Text text={getTimerText(props.time + (seconds * updateInterval))}
      x={480} y={28}
      styleName={'text'}
      hide={!props.active}></Text>
  );
}

export default Timer;
