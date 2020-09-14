import React from 'react';
import { useSelector } from 'react-redux';
import { Set, Text } from 'react-raphael';
import { isArray, map } from 'lodash';

import { BOARD_TYPES, NOTE_NUMS } from 'components/constants';
import { selectors as boardsSelectors } from 'redux/boards';

import './styles.less';

function Notes({
  click,
  hide,
  index,
  width,
  x,
  y
}) {
  const notesCell = useSelector(state => boardsSelectors.getCellIndex(state, BOARD_TYPES.NOTES, index));

  return !hide ? (
    <Set>
      {map(NOTE_NUMS, n => {
        const noteOffset = (n + 2) % 3;
        const noteRow = n <= 3 ? 1 : n > 3 && n <= 6 ? 2 : 3;

        return notesCell && isArray(notesCell) && notesCell.indexOf(n) > -1 ? (
          <Text text={n.toString()}
            key={`${index}-note-${n.toString()}`}
            x={x + (width / 4 * noteOffset) + 12.5}
            y={y + noteRow * 15 - 5}
            styleName={'text'}
            click={click} />
        ) : null;
      })}
    </Set>
  ) : null;
}

export default Notes;
