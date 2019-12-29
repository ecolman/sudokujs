import React from 'react'
import { Set, Text } from 'react-raphael';

import Checkbox from '../common/checkbox';
import './styles.less';

function Footer({ active, difficulty, notesMode, setNotesMode }) {
  return (
    <Set>
      <Text text={difficulty}
        x={38} y={600}
        styleName={`difficulty ${difficulty.toLowerCase()}`}
        hide={!active}></Text>

      <Set>
        <Text text={'Instructions'}
          x={250} y={583}
          styleName={`instructions header`}
          hide={!active}></Text>
        <Text text={'Clicking the red X in a cell will delete the cell.'}
          x={250} y={610}
          styleName={`instructions`}
          hide={!active}></Text>
        <Text text={'You can use your mouse, keyboard, or finger.'}
          x={250} y={596}
          styleName={`instructions`}
          hide={!active}></Text>
      </Set>

      <Set>
        <Text text={'Notes Mode'}
          x={460} y={600}
          styleName={`notes`}
          click={() => setNotesMode(!notesMode)}
          hide={!active}></Text>
        <Checkbox
          x={515} y={585}
          click={() => setNotesMode(!notesMode)}
          cssClass={'red'}
          hide={!active}
          value={notesMode}></Checkbox>
      </Set>
    </Set>
  );
}

export default Footer;
