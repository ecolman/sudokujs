import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Path, Raphael, Rect, Set, Text } from 'react-raphael';

import { FADES_MS } from 'components/constants';
import { selectors as boardsSelectors } from 'redux/boards';
import { actions as gameActions, selectors as gameSelectors } from 'redux/game';

import './styles.less';

function Controls() {
  const dispatch = useDispatch();
  const isActive = useSelector(gameSelectors.isActive);
  const isPaused = useSelector(gameSelectors.isPaused);
  const isSolved = useSelector(boardsSelectors.isSolved);

  const deactivateGame = () => isActive ? dispatch(gameActions.DEACTIVATE_GAME()) : null;
  const pauseGame = () => isActive ? dispatch(gameActions.PAUSE_GAME()) : null;
  const resumeGame = () => isActive ? dispatch(gameActions.RESUME_GAME()) : null;

  const pausePath = 'M127,15 L127,36 L132,36 L132,15 L125.9,15 M138,15 L138,36 L143,36 L143,15 Z'
  const playPath = 'M111,15 L111,35 L121,25 Z';

  let prevProps = useRef({
    isActive: false,
    isPaused: false
  });
  let isLoaded = useRef(false);

  const btnText = isPaused ? 'Play' : 'Pause';
  const pausePlayPath = prevProps.current.isPaused ? playPath : pausePath;
  const pausePlayAnimationPath = prevProps.current.isPaused ? pausePath : playPath;
  const pausePlayAnimation = isLoaded.current
    ? prevProps.current.isActive
      ? Raphael.animation({ path: pausePlayAnimationPath, opacity: isActive || isPaused ? .7 : 0 }, FADES_MS.FAST, '<>')
      : Raphael.animation({ opacity: isActive || isPaused ? .7 : 0 }, FADES_MS.FAST)
    : Raphael.animation({ opacity: 0 });
  const opacityAnimation = isLoaded.current
    ? Raphael.animation({ opacity: isActive ? .7 : 0 }, FADES_MS.FAST)
    : Raphael.animation({ opacity: 0 });

  prevProps.current = { isActive, isPaused };
  isLoaded.current = true;

  const pausePlayClick = isPaused ? resumeGame : pauseGame;
  const cssClasses = `${!isActive ? ' inactive' : ''}`

  return (
    <Set>
      { /* Back Button */ }
      <Set>
        <Rect x={0} y={0}
          width={67} height={30}
          styleName={'container'}
          animate={opacityAnimation}
          click={deactivateGame} />
        <Path d={'M15,15 L15,35 L5,25 Z'}
          styleName={`path${cssClasses}`}
          animate={opacityAnimation}
          click={deactivateGame} />
        <Text x={40} y={25}
          text={'Menu'}
          styleName={`text${cssClasses}`}
          animate={opacityAnimation}
          click={deactivateGame} />
      </Set>

      { /* Pause/Play Button */ }
      { !isSolved && (
        <Set>
          <Rect x={65} y={0}
            width={80} height={30}
            styleName={'container'}
            animate={opacityAnimation}
            click={pausePlayClick} />
          <Path d={pausePlayPath}
            styleName={`path${cssClasses}`}
            animate={pausePlayAnimation}
            hide={!isActive && !isPaused}
            click={pausePlayClick} />
          <Text x={isPaused ? 85.5 : 93} y={25}
            text={`| ${btnText}`}
            styleName={`text${cssClasses}`}
            animate={opacityAnimation}
            click={pausePlayClick} />
        </Set>
      )}
    </Set>
  );
}

export default Controls;
