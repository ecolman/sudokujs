import React from 'react'
import PropTypes from 'prop-types';

import * as constants from '../constants';

import { Raphael, Paper, Set, Circle, Ellipse, Image, Rect, Text, Path, Line } from 'react-raphael';


const Cell = ({ index, row, col, value, onClick }) => (
  <Set key={index} container={{className:'test'}}>
    <Rect
      x={constants.sizes.cell.width * col + 3}
      y={constants.sizes.cell.height * row + constants.sizes.cell.height}
      width={constants.sizes.cell.width}
      height={constants.sizes.cell.height}
      attr={{ class:'cell', 'stroke-width': .3, opacity: 1 }} />
    <Text
      x={constants.sizes.cell.width * col + 3 + (constants.sizes.cell.width / 2)}
      y={constants.sizes.cell.height * row + constants.sizes.cell.height + (constants.sizes.cell.height / 2)}
      text={value.toString()}
      attr={{ class:'cell-text' }} />
  </Set>
)

Cell.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Cell;
