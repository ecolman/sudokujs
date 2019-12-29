import React, { useRef } from 'react'
import { Path, Raphael, Rect, Set, Text } from 'react-raphael';

import './styles.less';

function Controls(props) {
  const { active, paused } = props;
  const pause = 'M 127,15 L 127,36 L 132,36 L 132,15 L 125.9,15 M 138,15 L 138,36 L 143,36 L 143,15 Z'
  const play = 'M 111,15 L 111,35 L 121,25 Z';

  let lastActive = useRef(false);
  let lastPaused = useRef(false);

  const btnText = paused ? 'Play' : 'Pause';
  const path = lastPaused.current ? play : pause;
  const animationPath = lastPaused.current ? pause : play
  const animation = lastActive.current ? Raphael.animation({ path: animationPath }, 300, '<>') : null;

  lastActive.current = active;
  lastPaused.current = paused;

  return (
    <Set>
      { /* Back Button */ }
      <Set>
        <Rect x={0} y={0}
          width={67} height={30}
          styleName={'container'}
          click={props.deactivateGame}
          hide={!active}></Rect>
        <Path d={'M 15 15 l 0 20 l -10 -10 z'}
          styleName={'path'}
          click={props.deactivateGame}
          hide={!active}></Path>
        <Text x={40} y={25}
          text={'Menu'}
          styleName={'text'}
          click={props.deactivateGame}
          hide={!active}></Text>
      </Set>

      { /* Pause/Play Button */ }
      <Set>
        <Rect x={65} y={0}
          width={80} height={30}
          styleName={'container'}
          click={paused ? props.resumeGame : props.pauseGame}
          hide={!active}></Rect>
        <Path d={path}
          styleName={'path'}
          click={paused ? props.resumeGame : props.pauseGame}
          animate={animation}
          hide={!active}></Path>
        <Text x={paused ? 85.5 : 93} y={25}
          text={`| ${btnText}`}
          styleName={'text'}
          click={paused ? props.resumeGame : props.pauseGame}
          hide={!active}></Text>
      </Set>
    </Set>
  );
}

export default Controls;
