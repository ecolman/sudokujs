import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Raphael, Set, Text } from 'react-raphael';

import Checkbox from '../common/checkbox';

import { BOARD_TYPES, FADES_MS } from 'components/constants';
import { selectors as boardsSelectors } from 'redux/boards';
import { actions as gameActions, selectors as gameSelectors } from 'redux/game';

import './styles.less';

function Footer() {
  const dispatch = useDispatch();
  const baseBoard = useSelector(state => boardsSelectors.getBoard(state, BOARD_TYPES.BASE));
  const isSolved = useSelector(boardsSelectors.isSolved);

  const active = useSelector(gameSelectors.isActive);
  const difficulty = baseBoard ? baseBoard.difficulty : '';
  const notesMode = useSelector(gameSelectors.isNotesMode);
  const setNotesMode = isNotesMode => !isSolved ? dispatch(gameActions.SET_NOTES_MODE(isNotesMode)) : null;

  let isLoaded = useRef(false);

  const animation = isLoaded.current
    ? Raphael.animation({ opacity: active ? 1 : 0 }, FADES_MS.FAST)
    : Raphael.animation({ opacity: 0 });

  isLoaded.current = true;

  return (
    <Set>
      <Text text={difficulty}
        x={38} y={600}
        styleName={`difficulty ${difficulty.toLowerCase()}`}
        animate={animation}></Text>

      <Set>
        <Text text={'https://github.com/ecolman/sudokujs'}
          x={250} y={610}
          styleName={`instructions link`}
          click={() => window.open('https://github.com/ecolman/sudokujs')}
          animate={animation}></Text>
        <Text text={'Created by Eric Colman'}
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
