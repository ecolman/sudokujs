import React from 'react'
import { Raphael, Rect, Set, Text } from 'react-raphael';
import { map } from 'lodash';

import Options from './options';
import { difficulties } from '../../../../game/constants';
import './styles.less';

function Menu(props) {
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
            x={278} y={117}
            key={`menu-difficulty-${d}`}
            styleName={`difficulty ${d.toLowerCase()}`}
            click={() => props.startGame(d)}
            hide={hide}
            load={toFront} update={toFront}></Text>
          <Rect x={278} y={117}
            key={`menu-difficulty-${d}-btn`}
            styleName={`difficulty ${d.toLowerCase()} rect`}
            hide={hide}
            click={() => props.startGame(d)}
            load={toFront} update={toFront}></Rect>
        </Set>
      ))}

      {/* Actions */}
      <Set>
        <Text text={'Resume Game'}
          x={275} y={335}
          styleName={`action resume`}
          click={props.resumeGame}
          hide={hide || props.stoppedAt === undefined}
          load={toFront} update={toFront}></Text>
        <Text text={'Load Last Game'}
          x={275} y={380}
          styleName={`action load`}
          hide={hide}
          load={toFront} update={toFront}></Text>
        <Text text={'Options'}
          x={275} y={420}
          styleName={`action options`}
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
