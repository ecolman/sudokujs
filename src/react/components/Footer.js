import React from 'react'
import { Set, Text } from 'react-raphael';

import Checkbox from './Checkbox';

const Footer = ({ active, difficulty, notesMode, setNotesMode }) => (
  <Set>
    <Text text={difficulty}
      x={38} y={600}
      attr={{ class: `footer difficulty ${difficulty.toLowerCase()}` }}
      hide={!active}></Text>

    <Set>
      <Text text={'Instructions'}
        x={250} y={583}
        attr={{ class: `footer instructions header` }}
        hide={!active}></Text>
      <Text text={'Clicking the red X in a cell will delete the cell.'}
        x={250} y={610}
        attr={{ class: 'footer instructions' }}
        hide={!active}></Text>
      <Text text={'You can use your mouse, keyboard, or finger.'}
        x={250} y={596}
        attr={{ class: 'footer instructions' }}
        hide={!active}></Text>
    </Set>

    <Set>
      <Text text={'Notes Mode'}
        x={460} y={600}
        attr={{ class: 'footer notes' }}
        click={() => setNotesMode(!notesMode)}
        hide={!active}></Text>
      <Checkbox
        x={515} y={585}
        click={() => setNotesMode(!notesMode)}
        hide={!active}
        value={notesMode}></Checkbox>
    </Set>
  </Set>
);

export default Footer;
