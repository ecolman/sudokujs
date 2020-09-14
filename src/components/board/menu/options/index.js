import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Path, Raphael, Set, Text } from 'react-raphael';

import Checkbox from 'components/common/checkbox';

import { FADE_MS, OPTIONS, PENALTY_MS } from 'components/constants';
import { actions as optionsActions, selectors as optionsSelectors } from 'redux/options';

import './styles.less';

function Options(props) {
  const dispatch = useDispatch();
  const feedback = useSelector(optionsSelectors.isFeedback);
  const highlighting = useSelector(optionsSelectors.isHighlighting);
  const numberFirst = useSelector(optionsSelectors.isNumberFirst);
  const optionsVisible = useSelector(optionsSelectors.isVisible);
  const penalty = useSelector(optionsSelectors.isPenalty);
  const removeNotes = useSelector(optionsSelectors.isRemoveNotes);
  const timer = useSelector(optionsSelectors.isTimer);

  const setOption = (option, value) => dispatch(optionsActions.SET_OPTION({ option, value }))

  const hide = !optionsVisible;
  const elToFront = el => optionsVisible ? el.toFront() : el.toBack();

  let isLoaded = useRef(false);
  let animation = isLoaded.current
    ? optionsVisible
      ? Raphael.animation({ opacity: 1 }, FADE_MS)
      : Raphael.animation({ opacity: 0 }, FADE_MS)
    : Raphael.animation({ opacity: 0 })

  isLoaded.current = true;

  return (
    <Set>
      {/* Back Button */}
      <Set>
        <Text text={'Save Options'}
          x={70} y={25}
          styleName={'save text'}
          animate={animation}
          click={() => setOption(OPTIONS.VISIBLE, false)}
          update={elToFront} />
        <Path d={'M15,15 L15,35 L5,25 Z'}
          styleName={'save path'}
          animate={animation}
          click={() => setOption(OPTIONS.VISIBLE, false)} />
      </Set>

      {/* Timer */}
      <Set>
        <Text text={'Enable Timer'}
          x={270} y={175}
          styleName={'option'}
          animate={animation}
          click={() => setOption(OPTIONS.TIMER, !timer)}
          update={elToFront} />
        <Checkbox
          x={350} y={160}
          click={() => setOption(OPTIONS.TIMER, !timer)}
          hide={hide}
          animate={animation}
          value={timer} />
      </Set>

      {/* Highlighting */}
      <Set>
        <Text text={'Number highlighting'}
          x={232} y={225}
          styleName={`option`}
          animate={animation}
          click={() => setOption(OPTIONS.HIGHLIGHTING, !highlighting)}
          update={elToFront} />
        <Checkbox
          x={350} y={210}
          click={() => setOption(OPTIONS.HIGHLIGHTING, !highlighting)}
          hide={hide}
          animate={animation}
          value={highlighting} />
      </Set>

      {/* Notes */}
      <Set>
        <Text text={'Auto Remove Notes'}
          x={244} y={275}
          styleName={`option`}
          animate={animation}
          click={() => setOption(OPTIONS.REMOVE_NOTES, !removeNotes)}
          update={elToFront} />
        <Checkbox
          x={350} y={260}
          click={() => setOption(OPTIONS.REMOVE_NOTES, !removeNotes)}
          hide={hide}
          animate={animation}
          value={removeNotes} />
      </Set>

      {/* Number First */}
      <Set>
        <Text text={'Select Number First'}
          x={233} y={325}
          styleName={`option`}
          animate={animation}
          click={() => setOption(OPTIONS.NUMBER_FIRST, !numberFirst)}
          update={elToFront} />
        <Text text={'(instead of selecting cell and then number)'}
          x={180} y={343}
          styleName={`option description`}
          animate={animation}
          click={() => setOption(OPTIONS.NUMBER_FIRST, !numberFirst)}
          update={elToFront} />
        <Checkbox
          x={350} y={310}
          click={() => setOption(OPTIONS.NUMBER_FIRST, !numberFirst)}
          hide={hide}
          animate={animation}
          value={numberFirst} />
      </Set>

      {/* Instant Feedback */}
      <Set>
        <Text text={'Instant Feedback'}
          x={248} y={378}
          styleName={`option`}
          animate={animation}
          click={() => setOption(OPTIONS.FEEDBACK, !feedback)}
          update={elToFront} />
        <Checkbox
          x={350} y={360}
          click={() => setOption(OPTIONS.FEEDBACK, !feedback)}
          hide={hide}
          animate={animation}
          value={feedback} />
      </Set>

      {/* Penalty */}
      <Set>
        <Text text={'Penalty for wrong number'}
          x={206} y={425}
          styleName={`option`}
          animate={animation}
          click={() => setOption(OPTIONS.PENALTY, !penalty)}
          update={elToFront} />
        <Text text={`(+${PENALTY_MS / 1000} seconds, when instant feedback enabled)`}
          x={180} y={440}
          styleName={`option description`}
          animate={animation}
          click={() => setOption(OPTIONS.PENALTY, !penalty)}
          update={elToFront} />
        <Checkbox
          x={350} y={410}
          click={() => setOption(OPTIONS.PENALTY, !penalty)}
          hide={hide}
          animate={animation}
          value={penalty} />
      </Set>
    </Set>
  )
}

export default Options;
