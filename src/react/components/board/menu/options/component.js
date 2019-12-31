import React, { useRef } from 'react'
import { Path, Raphael, Set, Text } from 'react-raphael';

import { FADE_MS, PENALTY_MS } from '../../../../constants';

import Checkbox from '../../../common/checkbox';
import './styles.less';

function Options(props) {
  const {
    feedback,
    highlighting,
    numberFirst,
    options,
    optionsVisible,
    penalty,
    removeNotes,
    timer
  } = props;
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
          click={() => props.setOption(options.VISIBLE, false)}
          update={elToFront} />
        <Path d={'M15,15 L15,35 L5,25 Z'}
          styleName={'save path'}
          animate={animation}
          click={() => props.setOption(options.VISIBLE, false)} />
      </Set>

      {/* Timer */}
      <Set>
        <Text text={'Enable Timer'}
          x={270} y={175}
          styleName={'option'}
          animate={animation}
          click={() => props.setOption(options.TIMER, !timer)}
          update={elToFront} />
        <Checkbox
          x={350} y={160}
          click={() => props.setOption(options.TIMER, !timer)}
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
          click={() => props.setOption(options.HIGHLIGHTING, !highlighting)}
          update={elToFront} />
        <Checkbox
          x={350} y={210}
          click={() => props.setOption(options.HIGHLIGHTING, !highlighting)}
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
          click={() => props.setOption(options.REMOVE_NOTES, !removeNotes)}
          update={elToFront} />
        <Checkbox
          x={350} y={260}
          click={() => props.setOption(options.REMOVE_NOTES, !removeNotes)}
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
          click={() => props.setOption(options.NUMBER_FIRST, !numberFirst)}
          update={elToFront} />
        <Text text={'(instead of selecting cell and then number)'}
          x={180} y={343}
          styleName={`option description`}
          animate={animation}
          click={() => props.setOption(options.NUMBER_FIRST, !numberFirst)}
          update={elToFront} />
        <Checkbox
          x={350} y={310}
          click={() => props.setOption(options.NUMBER_FIRST, !numberFirst)}
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
          click={() => props.setOption(options.FEEDBACK, !feedback)}
          update={elToFront} />
        <Checkbox
          x={350} y={360}
          click={() => props.setOption(options.FEEDBACK, !feedback)}
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
          click={() => props.setOption(options.PENALTY, !penalty)}
          update={elToFront} />
        <Text text={`(+${PENALTY_MS / 1000} seconds, when instant feedback enabled)`}
          x={180} y={440}
          styleName={`option description`}
          animate={animation}
          click={() => props.setOption(options.PENALTY, !penalty)}
          update={elToFront} />
        <Checkbox
          x={350} y={410}
          click={() => props.setOption(options.PENALTY, !penalty)}
          hide={hide}
          animate={animation}
          value={penalty} />
      </Set>
    </Set>
  )
}

export default Options;
