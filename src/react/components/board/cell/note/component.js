import React from 'react'
import { Set, Text } from 'react-raphael';
import { isArray, map } from 'lodash';

import { NOTE_NUMS } from '../../../../constants';
import './styles.less';

function Notes(props) {
  let { col, hide, notes, row, width, x, y } = props;

  return !hide ? (
    <Set>
      {map(NOTE_NUMS, n => {
        const noteOffset = (n + 2) % 3;
        const noteRow = n <= 3 ? 1 : n > 3 && n <= 6 ? 2 : 3;

        return isArray(notes) && notes.indexOf(n) > -1 ? (
          <Text text={n.toString()}
            key={`${row}-${col}-note-${n.toString()}`}
            x={x + (width / 4 * noteOffset) + 12.5}
            y={y + noteRow * 15 - 5}
            styleName={'text'} />
        ) : null;
      })}
    </Set>
  ) : null;
}

export default Notes;
