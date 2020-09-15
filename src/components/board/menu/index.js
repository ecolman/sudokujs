import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Raphael, Rect, Set, Text } from 'react-raphael';
import { map } from 'lodash';

import Options from './options';

import { DIFFICULTIES, FADES_MS, OPTIONS } from 'components/constants';
import { actions as gameActions, selectors as gameSelectors } from 'redux/game'
import { actions as optionsActions, selectors as optionsSelectors } from 'redux/options';

import './styles.less';

function Menu() {
  const dispatch = useDispatch();
  const isActive = useSelector(gameSelectors.isActive);
  const isLoading = useSelector(gameSelectors.isLoading);
  const optionsVisible = useSelector(optionsSelectors.isVisible);
  const paused = useSelector(gameSelectors.isPaused);
  const stoppedAt = useSelector(gameSelectors.getStoppedAt);

  const hide = isActive || optionsVisible || isLoading;
  const showEl = el => {
    if (!hide) {
      el.show();
      el.toFront();
    } else {
      el.hide()
    }
  };
  const showElNotActive = el => {
    if (!isActive && !paused && !isLoading) {
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
      animation = Raphael.animation({ y: optionsTextBottomY }, FADES_MS.FAST, '<>');
    } else if (prevOptionsVisible.current.isActive === false) {
      optionsTextY = 125;
      animation = Raphael.animation({ y: optionsTextTopY }, FADES_MS.FAST, '<>');
    }
  }

  return (
    <Set>
      <Rect width={540} height={450}
        x={3} y={50}
        styleName={`container`}
        load={showElNotActive} update={showElNotActive} />

      {/* Difficulties, transforms done through css */}
      {map(DIFFICULTIES, d => (
        <Set key={`menu-difficulty-${d}-container`}>
          <Text text={d}
            x={275} y={117}
            key={`menu-difficulty-${d}`}
            styleName={`difficulty ${d.toLowerCase()}`}
            click={() => dispatch(gameActions.START_GAME_REQUEST({ difficulty: d }))}
            load={showEl} update={showEl}></Text>
          <Rect x={275} y={117}
            key={`menu-difficulty-${d}-btn`}
            styleName={`difficulty ${d.toLowerCase()} rect`}
            click={() => dispatch(gameActions.START_GAME_REQUEST({ difficulty: d }))}
            load={showEl} update={showEl}></Rect>
        </Set>
      ))}

      {/* Actions */}
      <Set>
        <Text text={'Resume Game'}
          x={275} y={335}
          styleName={`action resume`}
          click={() => dispatch(gameActions.RESUME_GAME())}
          hide={hide || stoppedAt === undefined}
          load={showEl} update={showEl}></Text>
        <Rect x={275} y={335}
          styleName={`action resume rect`}
          click={() => dispatch(gameActions.RESUME_GAME())}
          load={showEl} update={showEl}></Rect>
        {/* <Text text={'Load Last Game'}
          x={275} y={380}
          styleName={`action load`}
          load={showEl} update={showEl}></Text> */}
        <Text text={'Options'}
          x={275} y={optionsTextY}
          styleName={`action options`}
          animate={animation}
          click={() => dispatch(optionsActions.SET_OPTION({ option: OPTIONS.VISIBLE, value: true }))}
          load={showElNotActive} update={showElNotActive}></Text>
        <Rect x={275} y={optionsTextY}
          styleName={`action options rect`}
          click={() => dispatch(optionsActions.SET_OPTION({ option: OPTIONS.VISIBLE, value: true }))}
          load={showEl} update={showEl}></Rect>
      </Set>

      <Options></Options>
    </Set>
  )
}

export default Menu;
