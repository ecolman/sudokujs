import React from 'react';
import PropTypes from 'prop-types';

import { times } from 'lodash';

import Cell from '../containers/Cell';
import Controls from '../containers/Controls';
import { rows } from '../../redux/actions';

import { Raphael, Paper, Set, Circle, Ellipse, Image, Rect, Text, Path, Line } from 'react-raphael';


// back button clickable region
// var clickRegion = this.paper.rect(0, 10, 67, 30).attr({ fill: "#fff", stroke: '#fff' });
// clickRegion.node.id = 'backClickRegion';
// $(clickRegion.node).attr({
//   class: 'clickableRegion',
//   'data-board': true,
//   'data-button': true,
//   'data-button-type': 'back'
// }).hide();

// // back button path
// var button = this.paper
//   .path("M 15 15 l 0 20 l -10 -10 z")
//   .attr({ fill: '#000', stroke: '#000', 'stroke-width': 2 });
// button.node.id = 'backButton';
// $(button.node).attr({
//   'data-board': true,
//   'data-button': true,
//   'data-button-type': 'back'
// }).hide();

// // back button text
// var text = this.paper.text(39, uiConstants.sizes.cell.height / 2, 'Menu ');
// text.node.id = 'backButtonText';
// $(text.node).attr({
//   'data-board': true,
//   'data-button': true,
//   'data-button-type': 'back'
// }).hide();

// // attach handler
// $('[data-button=true][data-button-type="back"]').bind(this.clickEventType, function () {
//   // check if game was paused, and subtract one second if going to menu from pause

//   //menu.homeView(sudoku.isGameInProgress());

//   if (this.paused) {
//     this.timeElapsedInSec -= 1;

//     if (this.touchEnabled) {
//       $('[data-button-type="pauseSymbol"]')
//         .css({ opacity: 0 })
//         .hide();
//     } else {
//       $('[data-button-type="pauseSymbol"]')
//         .animate({ opacity: 0 }, 200, function () {
//           $(this).hide();
//         });
//     }
//   }
// });


const Board = ({ board }) => {
  var gridLines = [
    { path:'M2,50L545,50', attr: { class: 'gridline' }},
    { path:'M2,500L545,500', attr: { class: 'gridline' }},
    { path:'M3,48L3,502', attr: { class: 'gridline' }},
    { path:'M543,50L543,502', attr: { class: 'gridline' }},
    { path:'M2,200L545,200', attr: { class: 'gridline' }},
    { path:'M2,350L545,350', attr: { class: 'gridline' }},
    { path:'M183,50L183,502', attr: { class: 'gridline' }},
    { path:'M363,50L363,502', attr: { class: 'gridline' }}
  ];

  var hideTimer = false;

  return (<Paper width={545} height={623}>
    {/* Gridlines */}
    <Set>
      {gridLines.map((line, index) => (
        <Path d={line.path} attr={line.attr} key={`gridline${index}`}></Path>
      ))}
    </Set>

    {/* Timer */}
    <Text x={480} y={38} text="00:00" hide={hideTimer} attr={{ class: 'timer' }}></Text>

    <Controls></Controls>

    {/* Cells */}
    <Set>
      {rows.map((row, rowIndex) =>
        times(9, cellIndex =>
          <Cell
            key={rowIndex * 9 + cellIndex}
            index={rowIndex * 9 + cellIndex}
            row={rowIndex}
            col={cellIndex}
            value={board[rowIndex][cellIndex]}
          />
        )
      )}
    </Set>
  </Paper>);
}

Board.propTypes = {
  board: PropTypes.array.isRequired
};

export default Board;
