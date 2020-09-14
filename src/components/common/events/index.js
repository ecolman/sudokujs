import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BOARD_TYPES } from 'components/constants';
import { getRowColumn } from 'game/utilities';
import { checkCell } from 'game/board';

import { actions as boardsActions, selectors as boardsSelectors } from 'redux/boards';
import { actions as gameActions, selectors as gameSelectors } from 'redux/game';

function Events(props) {
  const dispatch = useDispatch();
  const active = useSelector(gameSelectors.isActive);
  const baseBoard = useSelector(state => boardsSelectors.getBoard(state, BOARD_TYPES.BASE));
  const selectedCell = useSelector(gameSelectors.getSelectedCell);

  const clearCell = (row, col) => dispatch(boardsActions.CLEAR_CELL({ row, col }));
  const selectCell = index => dispatch(gameActions.SELECT_CELL(index));
  const setCell = (row, col, value) => dispatch(boardsActions.SET_CELL_REQUEST({ row, col, value }));

  let latestProps = useRef(props);  // keep latest props in a ref.

  useEffect(() => {
    latestProps.current = { baseBoard, selectedCell };
  });

  useEffect(() => {
    if (active) {
      document.addEventListener('keydown', handleKeyDown);

      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [active]);

  function handleKeyDown(event) {
    let { baseBoard, selectedCell } = latestProps.current;

    const key = event.charCode || event.keyCode || 0;

    if (key >= 49 && key <= 57 || key >= 97 && key <= 105) {
      // 1 - 9, add number to board
      const cellRowCol = getRowColumn(selectedCell);
      const keyDiff = key >= 49 && key <= 57 ? 48 : 96;
      const value = key - keyDiff;

      if (cellRowCol.row >= 0 && cellRowCol.col >= 0) {
        console.time('CELL COMPONENT CALL');
        setCell(cellRowCol.row, cellRowCol.col, value);
        console.timeEnd('CELL COMPONENT CALL');
      }
    } else if (key >= 37 && key <= 40) {  // arrow keys
      let cellIndex = selectedCell;

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

      if (cellIndex >= 0 && cellIndex <= 80 && cellIndex !== selectedCell) {
        selectCell(cellIndex);
      }
    } else if (key === 8 || key === 46) {
      const cellRowCol = getRowColumn(selectedCell);
      const prepopulated = !checkCell(baseBoard, cellRowCol.row, cellRowCol.col, 0);

      if (!prepopulated) {
        clearCell(cellRowCol.row, cellRowCol.col);
      }
    }
  }

  return (null);
}


export default Events;
