import React, { useRef } from 'react'
import { Path, Raphael, Rect, Set, Text } from 'react-raphael';

import { FADE_MS } from '../../../constants';

import './styles.less';

function Controls({ active, paused, solved, ...props }) {
  const pausePath = 'M127,15 L127,36 L132,36 L132,15 L125.9,15 M138,15 L138,36 L143,36 L143,15 Z'
  const playPath = 'M111,15 L111,35 L121,25 Z';

  let prevProps = useRef({
    active: false,
    paused: false
  })
  let isLoaded = useRef(false);

  const btnText = paused ? 'Play' : 'Pause';
  const pausePlayPath = prevProps.current.paused ? playPath : pausePath;
  const pausePlayAnimationPath = prevProps.current.paused ? pausePath : playPath;
  const pausePlayAnimation = isLoaded.current
    ? prevProps.current.active
      ? Raphael.animation({ path: pausePlayAnimationPath, opacity: active || paused ? .7 : 0 }, FADE_MS, '<>')
      : Raphael.animation({ opacity: active || paused ? .7 : 0 }, FADE_MS)
    : Raphael.animation({ opacity: 0 });
  const opacityAnimation = isLoaded.current
    ? Raphael.animation({ opacity: active ? .7 : 0 }, FADE_MS)
    : Raphael.animation({ opacity: 0 });

  prevProps.current = { active, paused };
  isLoaded.current = true;

  const pausePlayClick = paused ? props.resumeGame : props.pauseGame;
  const cssClasses = `${!active ? ' inactive' : ''}`

  return (
    <Set>
      { /* Back Button */ }
      <Set>
        <Rect x={0} y={0}
          width={67} height={30}
          styleName={'container'}
          animate={opacityAnimation}
          click={props.deactivateGame} />
        <Path d={'M15,15 L15,35 L5,25 Z'}
          styleName={`path${cssClasses}`}
          animate={opacityAnimation}
          click={props.deactivateGame} />
        <Text x={40} y={25}
          text={'Menu'}
          styleName={`text${cssClasses}`}
          animate={opacityAnimation}
          click={props.deactivateGame} />
      </Set>

      { /* Pause/Play Button */ }
      { !solved && (
        <Set>
          <Rect x={65} y={0}
            width={80} height={30}
            styleName={'container'}
            animate={opacityAnimation}
            click={pausePlayClick} />
          <Path d={pausePlayPath}
            styleName={`path${cssClasses}`}
            animate={pausePlayAnimation}
            hide={!active && !paused}
            click={pausePlayClick} />
          <Text x={paused ? 85.5 : 93} y={25}
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
