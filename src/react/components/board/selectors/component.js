import React, { useEffect } from 'react'
import { Set, Rect, Text } from 'react-raphael';
import { times } from 'lodash';

import { checkCell } from '../../../../game/board';
import { getRowColumn } from '../../../../game/utilities';

import './styles.less';

const offset = 7.5;
const row = 11.5;
let glows = {};

function Selectors(props) {
  const {
    active,
    baseBoard,
    height,
    isNumberFirst,
    selectedCellIndex,
    selectorCellIndex,
    width
  } = props;

  function getCoords(index) {
    return {
      x: width * index + 3 + (index === 0 ? offset : index * 2 * offset + offset),
      y: height * row
    };
  }

  function handleClick(index) {
    if (isNumberFirst) {
      props.setSelector(selectorCellIndex === index ? -1 : index);
    } else if (selectedCellIndex > -1) {
      const coords = getRowColumn(selectedCellIndex);
      const prepopulated = !checkCell(baseBoard, coords.row, coords.col, 0);

      if (!prepopulated) {
        props.setCell(coords.row, coords.col, index + 1);
      }
    }
  }

  // call remove on glow effects if not active, but don't remove glow from array
  useEffect(() => {
    if (!active) {
      times(9, index => {
        if (glows[index]) {
          glows[index].remove();
        }
      })
    }
  }, [active]);

  return active ? (
    <Set>
      {times(9, index => {
        const pos = getCoords(index);
        const selector = index + 1;
        const isSelected = selectorCellIndex === index;

        return (
          <Set key={`selector-${index}`}>
            <Rect width={width} height={height}
              x={pos.x}
              y={pos.y}
              load={el => {
                if (glows[index] !== null) {
                  glows[index] = el.glow();
                }
              }}
              update={el => {
                if (active && isSelected && !glows[index]) {
                  glows[index] = el.glow();
                } else if ((!active || !isSelected) && glows[index]) {
                  glows[index].remove();
                  glows[index] = null;
                }
              }}
              styleName={'bg'} />

            <Text text={selector.toString()}
              x={pos.x + width / 2}
              y={pos.y + height / 2}
              styleName={'text'} />

            {/* Rect to capture events and highlight for entire cell */}
            <Rect width={width} height={height}
              x={pos.x}
              y={pos.y}
              styleName={'overlay'}
              click={() => handleClick(index)} />
          </Set>
        )
      })}
    </Set>
  ) : null;
};

export default Selectors;
