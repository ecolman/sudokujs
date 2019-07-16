import React from 'react'
import { Paper, Text } from 'react-raphael';

import Board from '../containers/Board';
import Controls from '../containers/Controls';
import Menu from '../containers/Menu';
import Timer from '../containers/Timer';
import Selectors from '../containers/Selectors';

const Sudoku = () => (
  <Paper width={545} height={623} container={{className: 'board'}}>
    <Controls />
    <Text text={'Sudoku JS'}
      x={275} y={25}
      attr={{ class: 'header__title' }}></Text>
    <Timer />

    <Board />
    <Menu />

    <Selectors />
  </Paper>
);

export default Sudoku;
