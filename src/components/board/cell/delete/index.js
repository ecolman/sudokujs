import React from 'react';
import { Raphael, Set, Path, Text } from 'react-raphael';
import { useDispatch, useSelector } from 'react-redux';

import { actions as boardsActions, selectors as boardsSelectors } from 'redux/boards';

import './styles.less';

function Delete(props) {
  const { col, hide, index, row, x, y } = props;
  const dispatch = useDispatch();

  const showCellNotes = useSelector(state => boardsSelectors.showCellNotes(state, index));

  // clear cell value or notes value
  const handleClick = () => dispatch(showCellNotes
    ? boardsActions.CLEAR_CELL_NOTES({ row, col })
    : boardsActions.CLEAR_CELL({ row, col })
  );

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
