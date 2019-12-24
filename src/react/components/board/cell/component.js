import React, { useState } from 'react'
import { Set, Rect, Text } from 'react-raphael';

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
  const rectCssClasses =  `bg${cssClass ? ` ${cssClass}` : ''}${isHighlighted && !isInactive ? ' highlight' : ''}${hovered && !isInactive ? ' hover ' : ''}${selected && !isInactive ? ' selected' : ''}${isInactive ? ' inactive' : ''}`;
  const textCssClasses = `text${cssClass ? ` ${cssClass}` : ''}${prepopulated && !isInactive ? ' prepopulated' : ''}`;
  const showDelete = (canDelete === undefined || canDelete === true) && selected && !isInactive && !prepopulated && (value > 0 || hasNotes);

  function handleClick() {
    if (!isInactive) {
      props.selectCell();

      if (!prepopulated && isNumberFirst) {
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

      {/* Rect to capture events and highlight for entire cell */}
      <Rect width={width} height={height}
        x={rectX}
        y={rectY}
        styleName={`overlay${isInactive ? ' inactive' : ''}`}
        click={handleClick}
        mouseover={toggleHovered}
        mouseout={toggleHovered} />

      {/* Delete Button */}
      <Text text={'X'}
        x={rectX + width - 10}
        y={rectY + 10}
        styleName={`text delete`}
        click={() => hasNotes ? props.deleteCellNotes() : props.clearCell()}
        hide={!showDelete} />
    </Set>
  );
}

export default Cell;
