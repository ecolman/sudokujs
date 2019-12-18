import React, { useEffect } from 'react';

import { getRowColumn } from '../../../../game/utilities';
import { checkCell } from '../../../../game/board';

function Events(props) {
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    }
  });

  function onKeyDown(event) {
    if (props.active) {
      const key = event.charCode || event.keyCode || 0;

      if (key >= 49 && key <= 57 || key >= 97 && key <= 105) {
        // 1 - 9, add number to board
        const cellRowCol = getRowColumn(props.selectedCell);
        const keyDiff = key >= 49 && key <= 57 ? 48 : 96;
        const num = key - keyDiff;
        const prepopulated = !checkCell(props.baseBoard, cellRowCol.row, cellRowCol.col, 0);

        if (!prepopulated) {
          if (props.notesMode) {
            if (props.notesBoard[props.selectedCell].indexOf(num) > -1) {
              props.deleteNote(cellRowCol.row, cellRowCol.col, num)
            } else {
              props.addNote(cellRowCol.row, cellRowCol.col, num)
            }
          } else {
            props.setCell(cellRowCol.row, cellRowCol.col, num)
          }
        }
      } else if (key >= 37 && key <= 40) {  // arrow keys
        let cellIndex = props.selectedCell;

        switch (key) {
          case 37:  // left
            cellIndex--;
            break;

          case 38:  // up
            cellIndex -= 9;
            break;

          case 39:  // right
            cellIndex++;
            break;

          case 40:  // down
            cellIndex += 9;
            break;
        }

        if (cellIndex >= 0 && cellIndex <= 80 && cellIndex !== props.selectedCell) {
          props.selectCell(cellIndex);
        }
      } else if (key === 8 || key === 46) {
        const cellRowCol = getRowColumn(props.selectedCell);
        const prepopulated = !checkCell(props.baseBoard, cellRowCol.row, cellRowCol.col, 0);

        if (!prepopulated) {
          props.clearCell(cellRowCol.row, cellRowCol.col);
        }
      }
    }
  }

  return null;
}


export default Events;
