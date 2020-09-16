import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Raphael, Set, Rect, Text } from 'react-raphael';
import { times } from 'lodash';

import { BOARD_TYPES, FADES_MS, SIZES } from 'components/constants';
import { getRowColumn } from 'game/utilities';
import { actions as boardsActions, selectors as boardsSelectors } from 'redux/boards';
import { actions as gameActions, selectors as gameSelectors } from 'redux/game';
import { selectors as optionsSelectors } from 'redux/options';

import './styles.less';

const offset = 7.5;
const row = 11.5;
let glows = {};

function Selectors(props) {
  const dispatch = useDispatch();
  const active = useSelector(gameSelectors.isActive);
  const selectedCellIndex = useSelector(gameSelectors.getSelectedCell);
  const selectorCellIndex = useSelector(gameSelectors.getSelectorCell);
  const isNumberFirst = useSelector(optionsSelectors.isNumberFirst);
  const isSolved = useSelector(boardsSelectors.isSolved);
  const playerBoardString = useSelector(state => boardsSelectors.getBoardString(state, BOARD_TYPES.PLAYER));

  const height = SIZES.SELECTOR.HEIGHT;
  const width = SIZES.SELECTOR.WIDTH;

  const setCell = (row, col, value) => dispatch(boardsActions.SET_CELL_REQUEST({ row, col, value }));
  const setSelector = index => dispatch(gameActions.SELECT_SELECTOR(index));

  let isLoaded = useRef(false);
  const animation = isLoaded.current
    ? (isDimmed) => Raphael.animation({ opacity: active ? isDimmed ? .4 : 1 : 0 }, FADES_MS.FAST)
    : () => Raphael.animation({ opacity: 0 });

  isLoaded.current = true;

  function getCoords(index) {
    return {
      x: width * index + 3 + (index === 0 ? offset : index * 2 * offset + offset),
      y: height * row
    };
  }

  function handleClick(index) {
    if (!isSolved) {
      if (isNumberFirst) {
        setSelector(selectorCellIndex === index ? -1 : index);
      } else if (selectedCellIndex > -1) {
        const coords = getRowColumn(selectedCellIndex);
        setCell(coords.row, coords.col, index + 1);
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
      });
    }
  }, [active]);

  return (
    <Set>
      {times(9, index => {
        const pos = getCoords(index);
        const selector = index + 1;
        const isSelected = selectorCellIndex === index;
        const regex = new RegExp(index + 1, 'g' );
        const isAllUsed = (playerBoardString.match(regex) || []).length > 8;

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
                if (active && isSelected && !isAllUsed && !glows[index]) {
                  glows[index] = el.glow();
                } else if ((!active || !isSelected || isAllUsed) && glows[index]) {
                  glows[index].remove();
                  glows[index] = null;
                }
              }}
              styleName={'bg'}
              animate={animation(isAllUsed)} />

            <Text text={selector.toString()}
              x={pos.x + width / 2}
              y={pos.y + height / 2}
              styleName={'text'}
              animate={animation(isAllUsed)} />

            {/* Rect to capture events and highlight for entire cell */}
            <Rect width={width} height={height}
              x={pos.x}
              y={pos.y}
              styleName={`overlay${!active ? ' inactive' : ''}`}
              animate={animation()}
              click={() => !isAllUsed ? handleClick(index) : null} />
          </Set>
        )
      })}
    </Set>
  );
};

export default Selectors;
