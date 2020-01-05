import React from 'react'
import { Raphael, Set, Path, Text } from 'react-raphael';

import './styles.less';

function Cell(props) {
  const { hasNotes, hide, x, y } = props;
  const handleClick = () => hasNotes ? props.deleteCellNotes() : props.clearCell();

  return !hide
    ? (
      <Set>
        <Path d={`M ${x - 7} ${y - 9}
           A 45 45, 0, 0, 0, ${x + 9} ${y + 9}
           L ${x + 9} ${y - 9} Z`}
          styleName={'path'}
          click={handleClick} />

        <Text text={'X'}
          x={x + 4}
          y={y - 3}
          styleName={'text'}
          click={handleClick} />
      </Set>
    )
    : null;
}

export default Cell;
