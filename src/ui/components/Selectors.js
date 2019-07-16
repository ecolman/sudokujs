import React from 'react'
import { Set } from 'react-raphael';
import { times } from 'lodash';

import Cell from '../containers/Cell';

const offset = 7.5

const Selectors = ({ active, onClick }) => {
  if (active) {
    return (
      <Set>
        {times(9, index =>
          <Cell
            class="selector"
            index={82 + index}
            key={82 + index}
            row={10.5}
            col={index}
            value={index + 1}
            width={45}
            height={45}
            offsetX={index === 0 ? offset : index * 2 * offset + offset}></Cell>
        )}
      </Set>
    );
  } else {
    return null;
  }
};

export default Selectors;
