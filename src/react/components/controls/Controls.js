import React from 'react'

import { Path, Raphael, Rect, Set, Text } from 'react-raphael';

let lastActive = false;

const Controls = props => {
  const pause = 'M 111 15 l 0 20 l 10 -10 z';
  const play = 'M 127 15 l 0 21 l 5 0 l 0 -21 l -6.1 0 M 138 15 l 0 21 l 5 0 l 0 -21 z';
  const btnText = props.paused ? 'Play' : 'Pause';

  let animation = lastActive ? Raphael.animation({ path: props.paused ? pause : play }, 1000, '<>') : null;

  lastActive = props.active;

  return (
    <Set>
      { /* Back Button */ }
      <Set>
        <Rect x={0} y={0}
          width={67} height={30}
          attr={{ class: 'controls btnBack container' }}
          click={props.active ? props.deactivateGame : props.resumeGame}
          hide={!props.active}></Rect>
        <Path d={'M 15 15 l 0 20 l -10 -10 z'}
          attr={{ class: 'controls btnBack path' }}
          click={props.active ? props.deactivateGame : props.resumeGame}
          hide={!props.active}></Path>
        <Text x={40} y={25}
          text={'Menu'}
          attr={{ class: 'controls btnBack text' }}
          click={props.active ? props.deactivateGame : props.resumeGame}
          hide={!props.active}></Text>
      </Set>

      { /* Pause/Play Button */ }
      <Set>
        <Rect x={65} y={0}
          width={80} height={30}
          attr={{ class: 'controls container' }}
          click={() => props.paused ? props.resumeGame() : props.pauseGame()}
          hide={!props.active}></Rect>
        <Path d={props.paused ? pause : play}
          attr={{ class: 'controls path' }}
          click={() => props.paused ? props.resumeGame() : props.pauseGame()}
          animate={animation}
          hide={!props.active}></Path>
        <Text x={props.paused ? 85.5 : 93} y={25}
          text={`| ${btnText}`}
          attr={{ class: 'controls text' }}
          click={() => props.paused ? props.resumeGame() : props.pauseGame()}
          hide={!props.active}></Text>
      </Set>
    </Set>
  );
}

export default Controls;
