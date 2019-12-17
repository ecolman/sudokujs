import React from 'react'
import { Set, Text } from 'react-raphael';

import Controls from './controls/Controls.container';
import Timer from './controls/Timer.container';

const Header = () => (
  <Set>
    <Controls />

    <Text text={'Sudoku JS'}
      x={275} y={25}
      attr={{ class: 'header' }}></Text>

    <Timer />
  </Set>
);

export default Header;
