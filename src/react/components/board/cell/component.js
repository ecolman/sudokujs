import React, { useState } from 'react'
import { Raphael, Set, Rect, Text } from 'react-raphael';

import { PENALTY_MS } from '../../../constants';

import Delete from './delete';
import Notes from './note';
import './styles.less';

function Cell(props) {
  const [hovered, setHovered] = useState(false);
  const {
    canDelete,
    cssClass,
    col,
    errored,
    hasNotes,
    height,
    isActive,
    isHighlighted,
    isPaused,
    isPenalty,
    isNumberFirst,
    prepopulated,
    offsetX,
    offsetY,
    row,
    selected,
    selectorIndex,
    width,
    value
  } = props;

  const rectX = width * col + 3 + offsetX;
  const rectY = height * (row + 1) + offsetY;

  const isInactive = !isActive || isPaused;
  const showDelete = (canDelete === undefined || canDelete === true) && selected && !isInactive && !prepopulated && (value > 0 || hasNotes);

  let rectCssClasses =  `bg${cssClass ? ` ${cssClass}` : ''}${isHighlighted && !isInactive ? ' highlight' : ''}`;
  rectCssClasses += `${hovered && !isInactive ? ' hover ' : ''}${selected && !isInactive ? ' selected' : ''}${!isActive ? ' inactive' : ''}${errored ? ' errored' : ''}`;
  let textCssClasses = `text${cssClass ? ` ${cssClass}` : ''}${prepopulated && !isInactive ? ' prepopulated' : ''}`;

  // clear error after animation plays
  if (errored) {
    setTimeout(props.clearError, 500);
  }

  function handleClick() {
    if (!isInactive) {
      props.selectCell();

      if (!prepopulated && isNumberFirst && selectorIndex > -1) {
        props.setCell(selectorIndex + 1)
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
      <Text text={value && value > 0 ? value.toString() : ''}
        x={rectX + width / 2}
        y={rectY + height / 2}
        styleName={textCssClasses} />

      <Notes index={props.index}
        width={width}
        row={row} col={col}
        x={width * col + (offsetX || 0)}
        y={height * row + (offsetY || 0) + height}
        hide={prepopulated || !isActive} />

      <Text text={`+${PENALTY_MS / 1000} sec`}
        x={rectX + width / 2}
        y={rectY + height / 2}
        hide={!(errored && isPenalty)}
        styleName={'penalty'}
        animate={Raphael.animation({ y: rectY + height / 2 - 60 }, 500)} />

      {/* Rect to capture events and highlight for entire cell */}
      <Rect width={width} height={height}
        x={rectX}
        y={rectY}
        styleName={`overlay${isInactive ? ' inactive' : ''}`}
        click={handleClick}
        mouseover={toggleHovered}
        mouseout={toggleHovered} />

      <Delete row={row} col={col}
        x={rectX + width - 10}
        y={rectY + 10}
        hasNotes={hasNotes}
        hide={!showDelete} />
    </Set>
  );
}

export default Cell;
