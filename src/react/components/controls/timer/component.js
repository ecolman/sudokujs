import React, { useEffect, useState } from 'react'
import { Text } from 'react-raphael';

import { getElapsedTime } from '../../../../game/utilities';
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
  const elapsed = getElapsedTime(props.time, props.startedAt, props.stoppedAt);

  useEffect(() => {
    console.log(props.active);
    if (props.active && !props.paused) {
      let interval = null;

      interval = setInterval(() => setSeconds(seconds => seconds + 1), props.updateInterval || 1000);

      return () => clearInterval(interval);
    }
  });

  return (
    <Text text={getTimerText(elapsed)}
      x={480} y={28}
      styleName={'text'}
      hide={!props.active}></Text>
  );
}

export default Timer;
