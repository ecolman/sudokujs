import React, { useRef } from 'react';
import { Raphael, Set, Path, Rect } from 'react-raphael';
import { times } from 'lodash';

import Cell from './cell';
import Menu from './menu';
import Selectors from './selectors';
import { checkCell } from '../../../game/board';
import { FADE_MS, MENU_BOARD } from '../../constants';

import './styles.less';

function Board(props) {
  const { active, baseBoard, displayBoard, paused } = props;
  let isLoaded = useRef(false);
  const animation = isLoaded.current
    ? Raphael.animation({ 'opacity': active ? .8 : .1 }, FADE_MS)
    : Raphael.animation({ 'opacity': .1 });
  const gridLines = [
    { path:'M2,50 L545,50 Z', animation },
    { path:'M2,500 L545,500 Z', animation },
    { path:'M3,48 L3,502 Z', animation },
    { path:'M543,50 L543,502 Z', animation },
    { path:'M2,200 L545,200 Z', animation },
    { path:'M2,350 L545,350 Z', animation },
    { path:'M183,50 L183,502 Z', animation },
    { path:'M363,50 L363,502 Z', animation }
  ];
  const elToFront = el => el.toFront();

  isLoaded.current = true;

  return (
    <Set>
      {/* Cells */}
      <Set>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rowIndex) =>
          times(9, colIndex => {
            const isPrepopulated = baseBoard ? !checkCell(baseBoard, rowIndex, colIndex, 0) : false;
            let cellVal = 0;

            if (!paused) {
              if (active) {
                cellVal = displayBoard[rowIndex][colIndex];
              } else {
                cellVal = MENU_BOARD[rowIndex][colIndex];
              }
            }

            return (
              <Cell value={cellVal}
                key={rowIndex * 9 + colIndex}
                index={rowIndex * 9 + colIndex}
                row={rowIndex} col={colIndex}
                isActive={!paused && active}
                prepopulated={isPrepopulated} />
            )
          })
        )}
      </Set>

      {/* Pause Symbol */}
      <Set>
        <Path d={'M230,207 L230,342 L260,342 L260,207 L230,207 M280,207 L280,342 L310,342 L310,207 Z'}
          styleName={'pause path'}
          hide={!paused}
          update={elToFront}></Path>
        <Rect
          x={230} y={207}
          height={135} width={80}
          styleName={'pause container'}
          click={props.resumeGame}
          hide={!paused}
          update={elToFront}></Rect>
      </Set>

      {/* Gridlines */}
      <Set>
        {gridLines.map((line, index) => (
          <Path d={line.path}
            key={`gridline${index}`}
            styleName={'gridline'}
            animate={line.animation}
            update={elToFront}></Path>
        ))}
      </Set>

      <Menu />

      <Selectors />
    </Set>
  );
}

export default Board;
