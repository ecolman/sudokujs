import React, { useRef } from 'react';
import { Raphael, Set, Path, Rect } from 'react-raphael';
import { useDispatch, useSelector } from 'react-redux';
import { map, times } from 'lodash';

import Cell from './cell';
import Menu from './menu';
import Selectors from './selectors';
import Loader from './loader';

import { CELL_ROWS, FADES_MS, MENU_BOARD } from 'components/constants';
import { actions as gameActions, selectors as gameSelectors } from 'redux/game';

import './styles.less';

function Board(props) {
  let isLoaded = useRef(false);
  const dispatch = useDispatch();

  const isActive = useSelector(gameSelectors.isActive);
  const isPaused = useSelector(gameSelectors.isPaused);
  const elToFront = el => el.toFront();

  const gridLineAnimation = isLoaded.current
    ? Raphael.animation({ 'opacity': isActive ? .8 : .1 }, FADES_MS.SLOW)
    : Raphael.animation({ 'opacity': .1 });
  const gridLines = [
    { path:'M2,50 L545,50 Z', animation: gridLineAnimation },
    { path:'M2,500 L545,500 Z', animation: gridLineAnimation },
    { path:'M3,48 L3,502 Z', animation: gridLineAnimation },
    { path:'M543,50 L543,502 Z', animation: gridLineAnimation },
    { path:'M2,200 L545,200 Z', animation: gridLineAnimation },
    { path:'M2,350 L545,350 Z', animation: gridLineAnimation },
    { path:'M183,50 L183,502 Z', animation: gridLineAnimation },
    { path:'M363,50 L363,502 Z', animation: gridLineAnimation }
  ];

  const pauseAnimation = Raphael.animation({ 'opacity': isPaused ? .4 : 0 }, FADES_MS.FAST);
  const pauseToFront = el => {
    if (isPaused) {
      el.toFront();
    } else {
      setTimeout(() => el.toBack(), FADES_MS.FAST);
    }
  };

  isLoaded.current = true;

  return (
    <Set>
      {/* Cells */}
      <Set>
        {map(CELL_ROWS, (row, rowIndex) =>
          times(9, colIndex => {
            return (
              <Cell
                key={rowIndex * 9 + colIndex}
                index={rowIndex * 9 + colIndex}
                row={rowIndex} col={colIndex}
                menuValue={MENU_BOARD[rowIndex][colIndex]}
                isActive={isActive}
                isPaused={isPaused}
              />
            )
          })
        )}
      </Set>

      {/* Pause Symbol */}
      <Set>
        <Path d={'M230,207 L230,342 L260,342 L260,207 L230,207 M280,207 L280,342 L310,342 L310,207 Z'}
          styleName={'pause path'}
          update={pauseToFront}
          animate={pauseAnimation} />
        <Rect
          x={230} y={207}
          height={135} width={80}
          styleName={'pause container'}
          click={() => dispatch(gameActions.RESUME_GAME())}
          update={pauseToFront} />
      </Set>

      {/* Gridlines */}
      <Set>
        {gridLines.map((line, index) => (
          <Path d={line.path}
            key={`gridline${index}`}
            styleName={'gridline'}
            animate={line.animation}
            update={elToFront} />
        ))}
      </Set>

      <Menu />

      <Selectors />

      <Loader />
    </Set>
  );
}

export default Board;
