import React, { useRef, useEffect, useState } from 'react'
import { Paper } from 'react-raphael';

import Board from './board';
import Footer from './footer';
import Header from './header';
import Events from './common/events';

import classes from './sudoku.less';

function Sudoku() {
  // css styles don't get loaded in time during development
  // loads paper in 10ms if in dev mode
  const [loaded, setLoaded] = useState(process.env.NODE_ENV === 'production');
  const paperContainer = useRef(null);

  useEffect(() => {
    if (!loaded) {
      setTimeout(() => setLoaded(true), 25);
    } else if (paperContainer.current.paper) {
      paperContainer.current.paper.setViewBox(0, 0, 545, 650, true);
      //paperContainer.current.paper.setSize('100%', '100%');
    }
  });

  return loaded
    ? (
      <Paper
        width={0} height={0} ref={paperContainer}
        container={{className: classes.paper}}>
        <Header />

        <Board />
        <Events />

        <Footer />
      </Paper>
    )
    : null;
}

export default Sudoku;
