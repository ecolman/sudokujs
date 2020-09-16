import React, { useEffect, useState } from 'react'
import { Paper } from 'react-raphael';

import Board from './board';
import Footer from './footer';
import Header from './header';
import Events from './common/events';
import Fireworks from './common/fireworks';

import classes from './sudoku.less';

function Sudoku() {
  // css styles don't get loaded in time during development
  // delays loading paper if in dev mode
  const [loaded, setLoaded] = useState(process.env.NODE_ENV === 'production');

  useEffect(() => {
    if (!loaded) {
      setTimeout(() => setLoaded(true), 25);
    }
  });

  return loaded
    ? (
      <>
        <Paper
          width={0} height={0}
          viewbox="0 0 545 650"
          container={{className: classes.paper}}>
          <Header />

          <Board />
          <Events />

          <Footer />
        </Paper>

        <Fireworks />
      </>
    )
    : null;
}

export default Sudoku;
