import React, { useEffect, useState, useRef } from 'react'
import { Raphael, Text } from 'react-raphael';

import { FADE_MS, PENALTY_MS } from '../../../constants';

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
  let { active, paused, time, penalties, timerEnabled } = props;

  const [seconds, setSeconds] = useState(0);
  let isLoaded = useRef(false);

  const updateInterval = props.updateInterval || 1000;

  const animation = isLoaded.current
    ? active && timerEnabled
      ? Raphael.animation({ opacity: 1 }, FADE_MS)
      : Raphael.animation({ opacity: 0 }, FADE_MS)
    : Raphael.animation({ opacity: 0 });

  isLoaded.current = true;

  // watches for active/paused changes and starts interval to update state every second
  useEffect(() => {
    if (props.active && !props.paused) {
      let interval = setInterval(() => setSeconds(seconds => seconds + 1), updateInterval);

      return () => clearInterval(interval);
    }
  }, [active, paused]);

  // when time changes, reset state
  useEffect(() => {
    setSeconds(0);
  }, [time])

  return (
    <Text text={getTimerText(time + (penalties * PENALTY_MS) + (seconds * updateInterval))}
      x={480} y={28}
      styleName={'text'}
      animate={animation} />
  );
}

export default Timer;
