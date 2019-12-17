import React from 'react'
import { Set, Text } from 'react-raphael';
import { isArray, map } from 'lodash';

const noteNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Notes = props => !props.hide ? (
  <Set>
    {map(noteNums, n => {
      const noteOffset = (n + 2) % 3;
      const noteRow = n <= 3 ? 1 : n > 3 && n <= 6 ? 2 : 3;

      return isArray(props.notes) && props.notes.indexOf(n) > -1 ? (
        <Text text={n.toString()}
          key={`${props.row}-${props.col}-note-${n.toString()}`}
          x={props.x + (props.width / 4 * noteOffset) + 12.5}
          y={props.y + noteRow * 15 - 5}
          attr={{ class: `board cell text note` }} />
      ) : null;
    })}
  </Set>
) : null;

export default Notes;
