import React from 'react';
import { Set, Path, Rect } from 'react-raphael';
import { times } from 'lodash';

import Cell from './cell';
import Menu from './menu';
import Selectors from './selectors';
import { checkCell } from '../../../game/board';

import './styles.less';

function Board(props) {
  const { active, baseBoard, displayBoard, menuBoard, paused } = props;
  const gridClass = active ? `gridline active` : `gridline`;
  const gridLines = [
    { path:'M2,50L545,50', class: gridClass },
    { path:'M2,500L545,500', class: gridClass },
    { path:'M3,48L3,502', class: gridClass },
    { path:'M543,50L543,502', class: gridClass },
    { path:'M2,200L545,200', class: gridClass },
    { path:'M2,350L545,350', class: gridClass },
    { path:'M183,50L183,502', class: gridClass },
    { path:'M363,50L363,502', class: gridClass }
  ];

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
                cellVal = menuBoard[rowIndex][colIndex];
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
        <Path d={'M 230 207 l 0 135 l 30 0 l 0 -135 l -30 0 M 280 207 l 0 135 l 30 0 l 0 -135 z'}
          styleName={'pause path'}
          hide={!paused}
          update={el => { el.toFront(); } }></Path>
        <Rect
          x={230} y={207}
          height={135} width={80}
          styleName={'pause container'}
          click={props.resumeGame}
          hide={!paused}
          update={el => { el.toFront(); } }></Rect>
      </Set>

      {/* Gridlines */}
      <Set>
        {gridLines.map((line, index) => (
          <Path d={line.path}
            key={`gridline${index}`}
            styleName={line.class}
            update={el => el.toFront() }></Path>
        ))}
      </Set>

      <Menu />

      <Selectors />
    </Set>
  );
}

export default Board;
