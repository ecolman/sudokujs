import React from 'react'
import { Set } from 'react-raphael';
import { times } from 'lodash';

import Cell from './cell/Cell.container';

const offset = 7.5

const Selectors = ({ active, onClick }) => {
  if (active) {
    return (
      <Set>
        {times(9, index =>
          <Cell value={index + 1}
            index={82 + index} key={82 + index}
            row={10.5} col={index}
            width={45} height={45}
            offsetX={index === 0 ? offset : index * 2 * offset + offset}
            class="selector"></Cell>
        )}
      </Set>
    );
  } else {
    return null;
  }
};

export default Selectors;