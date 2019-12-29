import React, { useEffect, useRef } from 'react'
import { Raphael, Rect, Set, Text } from 'react-raphael';
import { map } from 'lodash';

import Options from './options';
import { DIFFICULTIES } from '../../../constants';
import './styles.less';

function Menu(props) {
  const hide = props.isActive || props.optionsVisible;
  const elToFront = el => { el.toFront(); }

  const optionsTextTopY = 420;
  const optionsTextBottomY = 120;

  let optionsTextY = optionsTextTopY;
  let animation = null;
  let prevOptionsVisible = useRef(null);

  // capture previous props values to determine how to animate
  useEffect(() => {
    prevOptionsVisible.current = {
      isActive: props.isActive,
      optionsVisible: props.optionsVisible
    };
  }, [props.isActive, props.optionsVisible]);

  // if ref is null, means new component, don't animate
  if (prevOptionsVisible.current !== null) {
    // if options visible, animate to 125
    // if options not visible and not coming from an active board, animate
    if (props.optionsVisible) {
      animation = Raphael.animation({ y: optionsTextBottomY }, 300, '<>');
    } else if (prevOptionsVisible.current.isActive === false) {
      optionsTextY = 125;
      animation = Raphael.animation({ y: optionsTextTopY }, 300, '<>');
    }
  }

  return (
    <Set>
      {/* Difficulties, transforms done through css */}
      {map(DIFFICULTIES, d => (
        <Set key={`menu-difficulty-${d}-container`}>
          <Text text={d}
            x={275} y={117}
            key={`menu-difficulty-${d}`}
            styleName={`difficulty ${d.toLowerCase()}`}
            click={() => props.startGame(d)}
            hide={hide}
            load={elToFront} update={elToFront}></Text>
          <Rect x={275} y={117}
            key={`menu-difficulty-${d}-btn`}
            styleName={`difficulty ${d.toLowerCase()} rect`}
            hide={hide}
            click={() => props.startGame(d)}
            load={elToFront} update={elToFront}></Rect>
        </Set>
      ))}

      {/* Actions */}
      <Set>
        <Text text={'Resume Game'}
          x={275} y={335}
          styleName={`action resume`}
          click={props.resumeGame}
          hide={hide || props.stoppedAt === undefined}
          load={elToFront} update={elToFront}></Text>
        <Text text={'Load Last Game'}
          x={275} y={380}
          styleName={`action load`}
          hide={hide}
          load={elToFront} update={elToFront}></Text>
        <Text text={'Options'}
          x={275} y={optionsTextY}
          styleName={`action options`}
          animate={animation}
          click={props.showOptions}
          hide={props.isActive}
          load={elToFront} update={elToFront}></Text>
      </Set>

      <Options></Options>
    </Set>
  )
}

export default Menu;
