import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Raphael, Set, Rect, Text } from 'react-raphael';

import { BOARD_TYPES, FADES_MS, PENALTY_MS, SIZES } from 'components/constants';

import { actions as boardsActions, selectors as boardsSelectors } from 'redux/boards';
import { actions as gameActions, selectors as gameSelectors } from 'redux/game';
import { selectors as optionsSelectors } from 'redux/options';

import Delete from './delete';
import Notes from './note';
import './styles.less';

function Cell({
  canDelete,
  cssClass,
  col,
  index,
  isActive,
  isPaused,
  menuValue,
  row,
  ...props
}) {
  const [hovered, setHovered] = useState(false);
  const dispatch = useDispatch();

  const baseCell = useSelector(state => boardsSelectors.getCell(state, BOARD_TYPES.BASE, row, col));
  const displayCell = useSelector(state => boardsSelectors.getCell(state, BOARD_TYPES.DISPLAY, row, col));
  const notesCell = useSelector(state => boardsSelectors.getCellIndex(state, BOARD_TYPES.NOTES, index));

  const isPrepopulated = baseCell ? baseCell !== 0 : false;
  const hasNotes = notesCell.length > 0;
  let cellVal = isActive ? displayCell : menuValue;

  const height = props.height || SIZES.CELL.HEIGHT;
  const width = props.width || SIZES.CELL.WIDTH;
  const offsetX = props.offsetX || 0;
  const offsetY = props.offsetY || 0;
  const rectX = width * col + 3 + offsetX;
  const rectY = height * (row + 1) + offsetY;

  const isHighlighted = useSelector(state => (optionsSelectors.isHighlighting(state) && cellVal > 0 && boardsSelectors.getSelectedCellValue(state) === cellVal));
  const isNumberFirst = useSelector(optionsSelectors.isNumberFirst);
  const isPenalty = useSelector(optionsSelectors.isPenalty);
  const isInactive = !isActive || isPaused;
  const isErrored = useSelector(state => gameSelectors.isErrorCell(state, index));
  const isSelected = useSelector(state => gameSelectors.isSelectedCell(state, index));
  const isSolved = useSelector(boardsSelectors.isSolved);
  const selectorIndex = useSelector(gameSelectors.getSelectorCell);
  const showDelete = (canDelete === undefined || canDelete === true) && isSelected && !isInactive && !isPrepopulated && (cellVal > 0 || hasNotes);
  const showCellNotes = useSelector(state => boardsSelectors.showCellNotes(state, index));

  let rectCssClasses =  `bg${cssClass ? ` ${cssClass}` : ''}${isHighlighted && !isInactive ? ' highlight' : ''}`;
  rectCssClasses += `${hovered && !isInactive ? ' hover ' : ''}${isSelected && !isInactive ? ' selected' : ''}${!isActive ? ' inactive' : ''}${isErrored ? ' errored' : ''}`;
  let textCssClasses = `text${cssClass ? ` ${cssClass}` : ''}${isPrepopulated && !isInactive ? ' prepopulated' : ''}`;

  // clear error after animation plays
  if (isErrored) {
    setTimeout(() => dispatch(gameActions.SET_ERROR(-1)), FADES_MS.SLOW);
  }

  function handleClick() {
    if (!isInactive) {
      dispatch(gameActions.SELECT_CELL(index));

      if (!isPrepopulated && isNumberFirst && selectorIndex > -1 && !isSolved) {
        dispatch(boardsActions.SET_CELL_REQUEST({
          col, row,
          value: selectorIndex + 1
        }));
      }
    }
  }

  function toggleHovered() {
    if (!isInactive) {
      setHovered(!hovered);
    }
  }

  return (
    <Set>
      <Rect width={width} height={height}
        x={rectX}
        y={rectY}
        styleName={rectCssClasses} />
      <Text text={cellVal && cellVal > 0 ? cellVal.toString() : ''}
        x={rectX + width / 2}
        y={rectY + height / 2}
        styleName={textCssClasses}
        hide={isPaused} />

      <Notes index={index}
        width={width}
        x={width * col + (offsetX || 0)}
        y={height * row + (offsetY || 0) + height}
        click={handleClick}
        hide={isPrepopulated || isInactive || !showCellNotes} />

      <Text text={`+${PENALTY_MS / 1000} sec`}
        x={rectX + width / 2}
        y={rectY + height / 2}
        hide={!isErrored || !isPenalty}
        styleName={'penalty'}
        animate={Raphael.animation({ y: rectY + height / 2 - 60 }, FADES_MS.SLOW)} />

      {/* Rect to capture events and highlight for entire cell */}
      <Rect width={width} height={height}
        x={rectX}
        y={rectY}
        styleName={`overlay${isInactive ? ' inactive' : ''}`}
        click={handleClick}
        mouseover={toggleHovered}
        mouseout={toggleHovered} />

      <Delete index={index}
        row={row} col={col}
        x={rectX + width - 10}
        y={rectY + 10}
        hide={!showDelete || isSolved} />
    </Set>
  );
}

export default Cell;
