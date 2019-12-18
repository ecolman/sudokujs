import React, { useRef, useEffect } from 'react'
import { Paper } from 'react-raphael';

import Header from './layout/header';
import Board from './board';
import Menu from './menu';
import Events from './common/events';
import Footer from './layout/footer';

import classes from './sudoku.less';

function Sudoku() {
  const paperContainer = useRef(null);

  useEffect(() => {
    if (paperContainer.current.paper) {
      paperContainer.current.paper.setViewBox(0, 0, 545, 650, true);
      paperContainer.current.paper.setSize('100%', '100%');
    }
  })

  return (
    <Paper ref={paperContainer}
      width={0} height={0}
      container={{className: classes.paper}}>
      <Header />

      <Board />
      <Menu />
      <Events />

      <Footer />
    </Paper>
  );
}

export default Sudoku;
