import React from 'react';
import { Set, Path, Rect } from 'react-raphael';
import { times } from 'lodash';

import Cell from '../containers/Cell';

const Board = props => {
  const gridClass = props.active ? 'gridline active' : 'gridline';

  let gridLines = [
    { path:'M2,50L545,50', attr: { class: gridClass }, toFront: true },
    { path:'M2,500L545,500', attr: { class: gridClass }, toFront: true },
    { path:'M3,48L3,502', attr: { class: gridClass }, toFront: true },
    { path:'M543,50L543,502', attr: { class: gridClass }, toFront: true },
    { path:'M2,200L545,200', attr: { class: gridClass }, toFront: true },
    { path:'M2,350L545,350', attr: { class: gridClass }, toFront: true },
    { path:'M183,50L183,502', attr: { class: gridClass }, toFront: true },
    { path:'M363,50L363,502', attr: { class: gridClass }, toFront: true }
  ];

  console.log(props)

  return (
    <Set>
      {/* Gridlines */}
      <Set>
        {gridLines.map((line, index) => (
          <Path d={line.path}
            key={`gridline${index}`}
            attr={line.attr}
            update={el => { line.toFront ? el.toFront() : null; } }></Path>
        ))}
      </Set>

      {/* Cells */}
      <Set>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rowIndex) =>
          times(9, colIndex => (
            <Cell value={!props.paused ? !props.active ? props.menuBoard[rowIndex][colIndex] : props.displayBoard[rowIndex][colIndex] : 0}
              key={rowIndex * 9 + colIndex}
              index={rowIndex * 9 + colIndex}
              row={rowIndex}
              col={colIndex}
              isActive={!props.paused && props.active}
              prepopulated={props.baseBoard ? !props.baseBoard.checkCell(rowIndex, colIndex, 0) : false} />
          ))
        )}
      </Set>

      {/* Pause Symbol */}
      <Set>
        <Path d={'M 230 207 l 0 135 l 30 0 l 0 -135 l -30 0 M 280 207 l 0 135 l 30 0 l 0 -135 z'}
          attr={{ class: 'pause-symbol__path' }}
          hide={!props.paused}
          update={el => { el.toFront(); } }></Path>
        <Rect
          x={230} y={207}
          height={135} width={80}
          attr={{ class: 'pause-symbol__container' }}
          click={props.resumeGame}
          hide={!props.paused}
          update={el => { el.toFront(); } }></Rect>
      </Set>
    </Set>
  );
}

export default Board;
