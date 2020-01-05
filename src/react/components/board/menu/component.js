import React, { useEffect, useRef } from 'react'
import { Raphael, Rect, Set, Text } from 'react-raphael';
import { map } from 'lodash';

import Options from './options';
import { DIFFICULTIES, FADE_MS } from '../../../constants';
import './styles.less';

function Menu(props) {
  const { isActive, optionsVisible, paused, showOptions, stoppedAt } = props;
  const hide = isActive || optionsVisible;
  const showEl = el => {
    if (!hide) {
      el.show();
      el.toFront();
    } else {
      el.hide()
    }
  };
  const showElNotActive = el => {
    if (!isActive && !paused) {
      el.show();
      el.toFront();
    } else {
      el.hide()
    }
  };
  //const elToFront = el => hide ? el.hide() : el.show(); el.toFront();

  const optionsTextTopY = 420;
  const optionsTextBottomY = 120;

  let optionsTextY = optionsTextTopY;
  let animation = null;
  let prevOptionsVisible = useRef(null);

  // capture previous props values to determine how to animate
  useEffect(() => {
    prevOptionsVisible.current = {
      isActive: isActive,
      optionsVisible: optionsVisible
    };
  }, [isActive, optionsVisible]);

  // if ref is null, means new component, don't animate
  if (prevOptionsVisible.current !== null) {
    // if options visible, animate to 125
    // if options not visible and not coming from an active board, animate
    if (optionsVisible) {
      animation = Raphael.animation({ y: optionsTextBottomY }, FADE_MS, '<>');
    } else if (prevOptionsVisible.current.isActive === false) {
      optionsTextY = 125;
      animation = Raphael.animation({ y: optionsTextTopY }, FADE_MS, '<>');
    }
  }

  return (
    <Set>
      <Rect width={540} height={450}
        x={3} y={50}
        styleName={`container abc`}
        load={showElNotActive} update={showElNotActive} />

      {/* Difficulties, transforms done through css */}
      {map(DIFFICULTIES, d => (
        <Set key={`menu-difficulty-${d}-container`}>
          <Text text={d}
            x={275} y={117}
            key={`menu-difficulty-${d}`}
            styleName={`difficulty ${d.toLowerCase()}`}
            click={() => props.startGame(d)}
            load={showEl} update={showEl}></Text>
          <Rect x={275} y={117}
            key={`menu-difficulty-${d}-btn`}
            styleName={`difficulty ${d.toLowerCase()} rect`}
            click={() => props.startGame(d)}
            load={showEl} update={showEl}></Rect>
        </Set>
      ))}

      {/* Actions */}
      <Set>
        <Text text={'Resume Game'}
          x={275} y={335}
          styleName={`action resume`}
          click={props.resumeGame}
          hide={hide || stoppedAt === undefined}
          load={showEl} update={showEl}></Text>
        {/* <Text text={'Load Last Game'}
          x={275} y={380}
          styleName={`action load`}
          load={showEl} update={showEl}></Text> */}
        <Text text={'Options'}
          x={275} y={optionsTextY}
          styleName={`action options`}
          animate={animation}
          click={showOptions}
          load={showElNotActive} update={showElNotActive}></Text>
      </Set>

      <Options></Options>
    </Set>
  )
}

export default Menu;
