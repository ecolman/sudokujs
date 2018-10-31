import React from 'react'
import PropTypes from 'prop-types';

import * as constants from '../constants';

import { Raphael, Paper, Set, Circle, Ellipse, Image, Rect, Text, Path, Line } from 'react-raphael';

const Cell = ({ index, value, onClick }) => (
  <React.Fragment>
    <Rect
      x={constants.sizes.cell.width * index + 10}
      y={516}
      width={constants.sizes.cell.width}
      height={constants.sizes.cell.height}
      attr={{class: constants.classes.cell, 'stroke-width': .3, opacity: 1, 'data-auto-attach-events': false}} />
    <Text
      x={constants.sizes.cell.width * index + 33}
      y={550}
      text={index + 1} />
  </React.Fragment>
);

Cell.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Cell;
