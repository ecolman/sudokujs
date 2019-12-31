import React, { useRef } from 'react'
import { Raphael, Set, Text } from 'react-raphael';

import Checkbox from '../common/checkbox';
import { FADE_MS } from '../../constants';
import './styles.less';

function Footer({ active, difficulty, notesMode, setNotesMode }) {
  let isLoaded = useRef(false);

  const animation = isLoaded.current
    ? Raphael.animation({ opacity: active ? 1 : 0 }, FADE_MS)
    : Raphael.animation({ opacity: 0 });

  isLoaded.current = true;

  return (
    <Set>
      <Text text={difficulty}
        x={38} y={600}
        styleName={`difficulty ${difficulty.toLowerCase()}`}
        animate={animation}></Text>

      <Set>
        <Text text={'Instructions'}
          x={250} y={583}
          styleName={`instructions header`}
          animate={animation}></Text>
        <Text text={'Clicking the red X in a cell will delete the cell.'}
          x={250} y={610}
          styleName={`instructions`}
          animate={animation}></Text>
        <Text text={'You can use your mouse, keyboard, or finger.'}
          x={250} y={596}
          styleName={`instructions`}
          animate={animation}></Text>
      </Set>

      <Set>
        <Text text={'Notes Mode'}
          x={460} y={600}
          styleName={`notes`}
          click={() => setNotesMode(!notesMode)}
          animate={animation}></Text>
        <Checkbox
          x={515} y={585}
          click={() => setNotesMode(!notesMode)}
          cssClass={'red'}
          animate={animation}
          hide={!active}
          value={notesMode}></Checkbox>
      </Set>
    </Set>
  );
}

export default Footer;
