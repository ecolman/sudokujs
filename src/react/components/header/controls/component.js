import React, { useRef } from 'react'
import { Path, Raphael, Rect, Set, Text } from 'react-raphael';

import { FADE_MS } from '../../../constants';

import './styles.less';

function Controls(props) {
  const { active, paused } = props;
  const pausePath = 'M127,15 L127,36 L132,36 L132,15 L125.9,15 M138,15 L138,36 L143,36 L143,15 Z'
  const playPath = 'M111,15 L111,35 L121,25 Z';

  let prevProps = useRef({
    active: false,
    paused: false
  })
  let isLoaded = useRef(false);

  const btnText = paused ? 'Play' : 'Pause';
  const usedPath = prevProps.current.paused ? playPath : pausePath;
  const animationPath = prevProps.current.paused ? pausePath : playPath
  const animation = isLoaded.current
    ? prevProps.current.active
      ? Raphael.animation({ path: animationPath, opacity: active || paused ? 1 : 0 }, FADE_MS, '<>')
      : Raphael.animation({ opacity: active || paused ? 1 : 0 }, FADE_MS)
    : Raphael.animation({ opacity: 0 });
  const opacityAnimation = isLoaded.current
    ? Raphael.animation({ opacity: active ? .7 : 0 }, FADE_MS)
    : Raphael.animation({ opacity: 0 });

    console.log(active, paused);

  prevProps.current = { active, paused };
  isLoaded.current = true;

  const pausePlayClick = paused ? props.resumeGame : props.pauseGame

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
          styleName={'path'}
          animate={opacityAnimation}
          click={props.deactivateGame} />
        <Text x={40} y={25}
          text={'Menu'}
          styleName={'text'}
          animate={opacityAnimation}
          click={props.deactivateGame} />
      </Set>

      { /* Pause/Play Button */ }
      <Set>
        <Rect x={65} y={0}
          width={80} height={30}
          styleName={'container'}
          animate={opacityAnimation}
          click={pausePlayClick} />
        <Path d={usedPath}
          styleName={'path'}
          animate={animation}
          click={pausePlayClick} />
        <Text x={paused ? 85.5 : 93} y={25}
          text={`| ${btnText}`}
          styleName={'text'}
          animate={opacityAnimation}
          click={pausePlayClick} />
      </Set>
    </Set>
  );
}

export default Controls;
