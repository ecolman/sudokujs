import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Raphael, Text } from 'react-raphael';

import { FADES_MS, PENALTY_MS, UPDATE_MS } from 'components/constants';

import { selectors as boardsSelectors } from 'redux/boards'
import { selectors as gameSelectors } from 'redux/game'
import { selectors as optionsSelectors } from 'redux/options'

import './styles.less';

function getTimerText(lengthMs) {
  const lengthSecs = Math.floor(lengthMs / 1000);
  const hours = Math.floor((lengthSecs / 60) / 60);
  const minutes = Math.floor((lengthSecs / 60) - (hours * 60));
  const seconds = (lengthSecs - ((minutes * 60) + (hours * 60 * 60)));
  const formatTimeUnit = unit => `${unit === 0 ? '00' : ''}${unit > 0 && unit <= 9 ? '0' : ''}${unit > 0 ? unit : ''}`

  return `${hours > 0 ? `${formatTimeUnit(hours)}:` : ''}${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`;
}

function Timer() {
  const active = useSelector(gameSelectors.isActive);
  const paused = useSelector(gameSelectors.isPaused);
  const newGameStarted = useSelector(gameSelectors.isNewGameStarted);
  const penalties = useSelector(gameSelectors.getPenalties);
  const isSolved = useSelector(boardsSelectors.isSolved);
  const time = useSelector(gameSelectors.getTime);
  const timerEnabled = useSelector(optionsSelectors.isTimer);

  const [seconds, setSeconds] = useState(0);
  let isLoaded = useRef(false);

  const animation = isLoaded.current
    ? active && timerEnabled
      ? Raphael.animation({ opacity: 1 }, FADES_MS.FAST)
      : Raphael.animation({ opacity: 0 }, FADES_MS.FAST)
    : Raphael.animation({ opacity: 0 });

  isLoaded.current = true;

  // watches for active/paused changes and starts interval to update state every second
  useEffect(() => {
    let interval;

    if (active && !isSolved && !paused) {
      interval = setInterval(() => setSeconds(seconds => seconds + 1), UPDATE_MS);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [active, isSolved, paused]);

  // when new game starts, reset timer
  useEffect(() => {
    if (newGameStarted) {
      setSeconds(0);
    }
  }, [newGameStarted])

  return (
    <Text text={getTimerText(time + (penalties * PENALTY_MS) + (!isSolved && !paused ? seconds * UPDATE_MS : 0))}
      x={480} y={28}
      styleName={'text'}
      animate={animation} />
  );
}

export default Timer;
