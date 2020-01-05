import React from 'react'
import { Raphael, Set, Path, Text } from 'react-raphael';

import './styles.less';

function Delete(props) {
  const { hide, showCellNotes, x, y } = props;
  const handleClick = () => showCellNotes ? props.clearCellNotes() : props.clearCell();

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

export default Delete;
