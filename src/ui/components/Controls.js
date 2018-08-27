import React from 'react'
import PropTypes from 'prop-types';

import { Rect, Paper, Text, Path } from 'react-raphael';

const Controls = () => {
  var hideControls = false;

  return (
    <div ref="root">
      <Rect x={0} y={10} width={67} height={30} hide={hideControls} attr={{ fill: '#fff', stroke: '#fff'}}></Rect>
      <Path d={'M 15 15 l 0 20 l -10 -10 z'} hide={hideControls} attr={{ fill: '#000', stroke: '#000', 'stroke-width': 2 }}></Path>
      <Text x={39} y={25} text={'Menu'}></Text>
    </div>
  );
}

export default Controls;
