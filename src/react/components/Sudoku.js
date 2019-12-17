import React from 'react'
import { Paper } from 'react-raphael';

import Header from './Header';
import Board from './board/Board.container';
import Menu from './menu/Menu.container';
import Footer from './Footer.container';

class Sudoku extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // sets paper to a viewbox and paper size for scaling
    const paper = this.refs.sudokuContainer.paper;

    paper.setViewBox(0, 0, 545, 650, true);
    paper.setSize('100%', '100%');
  }

  render() {
    return (
      <Paper ref={'sudokuContainer'}
        width={0} height={0}
        container={{className: 'sudoku'}}>
        <Header />

        <Board />
        <Menu />

        <Footer />
      </Paper>
    );
  }
}

export default Sudoku;
