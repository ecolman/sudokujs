import React from 'react'
import PropTypes from 'prop-types';

import { Raphael, Paper, Set, Circle, Ellipse, Image, Rect, Text, Path, Line } from 'react-raphael';

const Cell = ({ index, row, col, value, onClick }) => (
  <Text x={150} y={index*10} text={value.toString()} attr={{"fill":"#000"}}/>
);

Cell.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Cell;
