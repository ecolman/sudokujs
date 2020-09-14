import React from 'react';
import { Set, Text } from 'react-raphael';

import Controls from './controls';
import Timer from './timer';
import './styles.less';

function Header() {
  return (
    <Set>
      <Controls />

      <Text text={'Sudoku JS'}
        x={275} y={25}
        styleName={'text'} />

      <Timer />
    </Set>
  )
}

export default Header;
