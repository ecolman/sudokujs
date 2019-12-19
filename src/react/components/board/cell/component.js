import React, { useState } from 'react'
import { Set, Rect, Text } from 'react-raphael';

import Notes from './note';
import './styles.less';

function Cell(props) {
  const [highlighted, setHighlight] = useState(false);

  function handleClick() {
    if (props.isActive) {
      props.selectCell();
    }
  }

  function toggleHighlight() {
    if (props.isActive === undefined || props.isActive && !props.isPaused) {
      setHighlight(!highlighted);
    }
  }

  const isInactive = !props.isActive || props.isPaused;
  const rectCssClasses =  `${props.class ? ` ${props.class}` : ''}${highlighted ? ' highlight' : ''}${props.selected && !isInactive ? ' selected' : ''}${isInactive ? ' inactive' : ''}`;
  const textCssClasses = `${props.class ? ` ${props.class}` : ''}${props.prepopulated && props.isActive ? ' prepopulated' : ''}`;

  return (
    <Set>
      <Rect width={props.width} height={props.height}
        x={props.width * props.col + 3 + props.offsetX}
        y={props.height * props.row + props.height + props.offsetY}
        styleName={`bg${rectCssClasses}`}/>
      <Text text={props.value && props.value > 0 ? props.value.toString() : ''}
        x={props.width * props.col + 3 + (props.width / 2) + (props.offsetX || 0)}
        y={props.height * props.row + props.height + (props.height / 2) + (props.offsetY || 0)}
        styleName={`text${textCssClasses}`} />

      <Notes index={props.index}
        width={props.width}
        row={props.row} col={props.col}
        x={props.width * props.col + (props.offsetx || 0)}
        y={props.height * props.row + (props.offsetY || 0) + props.height}
        hide={props.prepopulated || !props.isActive} />

      {/* Rect to capture events and highlight for entire cell */}
      <Rect width={props.width} height={props.height}
        x={props.width * props.col + 3 + props.offsetX}
        y={props.height * props.row + props.height + props.offsetY}
        styleName={`overlay${isInactive ? ' inactive' : ''}`}
        click={handleClick}
        mouseover={toggleHighlight}
        mouseout={toggleHighlight} />

      {/* Delete Button */}
      <Text text={'X'}
        x={props.width * props.col + props.width + props.offsetX - 5}
        y={props.height * props.row + props.height + props.offsetY + 10}
        styleName={`text delete`}
        click={() => props.setCell(0)}
        hide={!props.selected || props.prepopulated || !props.isActive || (props.value === 0 || !props.hasNotes)} />
    </Set>
  );
}

export default Cell;
