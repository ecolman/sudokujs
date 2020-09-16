# Sudoku-JS

Browser-based sudoku game using SVG via [raphaël](https://dmitrybaranovskiy.github.io/raphael/) with components written using react, redux, and sagas.

http://sudoku2.subtledetour.com/

### Features:
- Generates random boards using backtrack algorithm
- Saves games to local storage
- Options for different types of players (enable / disable timer, cell highlighting, number placement feeback, penalties)
- Notes mode

### Dependencies:
- [sudokutoolcollection](https://github.com/lacrioque/sudoku.js#readme) - sudoku puzzle generator and solver
- [react-raphael](https://github.com/liuhong1happy/react-raphael) - reactified raphael components

### Built with:
- [webpack](https://webpack.js.org/)
- [react](https://reactjs.org/)
- [react-redux](https://react-redux.js.org/) / [@reduxjs/toolkit](https://redux-toolkit.js.org/)
- [redux-saga](https://redux-saga.js.org/)
- [store](https://github.com/marcuswestin/store.js)
