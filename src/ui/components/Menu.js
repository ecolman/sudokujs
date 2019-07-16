import React from 'react'
import { Raphael, Rect, Set, Text } from 'react-raphael';
import { map } from 'lodash';

import Options from '../containers/options';
import { difficulties } from '../../redux/actions';

const Menu = props => {
  const hide = props.active || props.options;
  const toFront = el => { el.toFront(); }
  let animation = null;

  if (props.options) {
    animation = Raphael.animation({ y: 125 }, 300, '<>');
  }

  return (
    <Set>
      {/* Difficulties, transforms done through css */}
      {map(difficulties, d => (
        <Set key={`menu-difficulty-${d}-container`}>
          <Text text={d}
            x={278} y={125}
            key={`menu-difficulty-${d}`}
            attr={{ class: `menu difficulty ${d.toLowerCase()}` }}
            click={() => props.startGame(d)}
            hide={hide}
            load={toFront} update={toFront}></Text>
          <Rect x={278} y={125}
            key={`menu-difficulty-${d}-btn`}
            attr={{ class: `menu difficulty ${d.toLowerCase()} rect` }}
            hide={hide}
            click={() => props.startGame(d)}
            load={toFront} update={toFront}></Rect>
        </Set>
      ))}

      {/* Actions */}
      <Set>
        <Text text={'Resume Game'}
          x={275} y={340}
          attr={{ class: `menu action resume` }}
          click={props.resumeGame}
          hide={hide}
          load={toFront} update={toFront}></Text>
        <Text text={'Load Last Game'}
          x={275} y={385}
          attr={{ class: `menu action load` }}
          hide={hide}
          load={toFront} update={toFront}></Text>
        <Text text={'Options'}
          x={275} y={425}
          attr={{ class: `menu action options` }}
          animate={animation}
          click={props.showOptions}
          hide={props.active}
          load={toFront} update={toFront}></Text>
      </Set>

      <Options></Options>
    </Set>
  )
}

export default Menu;
