import React from 'react'
import { Path, Raphael, Set, Text } from 'react-raphael';

import { PENALTY_MS } from '../../../../constants';

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
  const elToFront = el => { el.toFront(); };
  let animation = Raphael.animation({ opacity: hide ? 0 : .7 }, 300);

  return (
    <Set>
      {/* Back Button */}
      <Set>
        <Text text={'Save Options'}
          x={70} y={25}
          animate={animation}
          styleName={'save text'}
          click={() => props.setOption(options.VISIBLE, false)}
          hide={hide}></Text>
        <Path d={'M 15 15 l 0 20 l -10 -10 z'}
          styleName={'save path'}
          animate={animation}
          click={() => props.setOption(options.VISIBLE, false)}
          hide={hide}></Path>
      </Set>

      {/* Timer */}
      <Set>
        <Text text={'Enable Timer'}
          x={270} y={175}
          styleName={'option'}
          click={() => props.setOption(options.TIMER, !timer)}
          hide={hide}
          update={elToFront}></Text>
        <Checkbox
          x={350} y={160}
          hide={hide}
          click={() => props.setOption(options.TIMER, !timer)}
          value={timer}></Checkbox>
      </Set>

      {/* Highlighting */}
      <Set>
        <Text text={'Number highlighting'}
          x={232} y={225}
          styleName={`option`}
          click={() => props.setOption(options.HIGHLIGHTING, !highlighting)}
          hide={hide}
          update={elToFront}></Text>
        <Checkbox
          x={350} y={210}
          click={() => props.setOption(options.HIGHLIGHTING, !highlighting)}
          hide={hide}
          value={highlighting}></Checkbox>
      </Set>

      {/* Notes */}
      <Set>
        <Text text={'Auto Remove Notes'}
          x={244} y={275}
          styleName={`option`}
          click={() => props.setOption(options.REMOVE_NOTES, !removeNotes)}
          hide={hide}
          update={elToFront}></Text>
        <Checkbox
          x={350} y={260}
          click={() => props.setOption(options.REMOVE_NOTES, !removeNotes)}
          hide={hide}
          value={removeNotes}></Checkbox>
      </Set>

      {/* Number First */}
      <Set>
        <Text text={'Select Number First'}
          x={233} y={325}
          styleName={`option`}
          click={() => props.setOption(options.NUMBER_FIRST, !numberFirst)}
          hide={hide}
          update={elToFront}></Text>
        <Text text={'(instead of selecting cell and then number)'}
          x={180} y={343}
          styleName={`option description`}
          click={() => props.setOption(options.NUMBER_FIRST, !numberFirst)}
          hide={hide}
          update={elToFront}></Text>
        <Checkbox
          x={350} y={310}
          click={() => props.setOption(options.NUMBER_FIRST, !numberFirst)}
          hide={hide}
          value={numberFirst}></Checkbox>
      </Set>

      {/* Instant Feedback */}
      <Set>
        <Text text={'Instant Feedback'}
          x={248} y={378}
          styleName={`option`}
          click={() => props.setOption(options.FEEDBACK, !feedback)}
          hide={hide}
          update={elToFront}></Text>
        <Checkbox
          x={350} y={360}
          click={() => props.setOption(options.FEEDBACK, !feedback)}
          hide={hide}
          value={feedback}></Checkbox>
      </Set>

      {/* Penalty */}
      <Set>
        <Text text={'Penalty for wrong number'}
          x={206} y={425}
          styleName={`option`}
          click={() => props.setOption(options.PENALTY, !penalty)}
          hide={hide}
          update={elToFront}></Text>
        <Text text={`(+${PENALTY_MS / 1000} seconds, when instant feedback enabled)`}
          x={180} y={440}
          styleName={`option description`}
          click={() => props.setOption(options.PENALTY, !penalty)}
          hide={hide}
          update={elToFront}></Text>
        <Checkbox
          x={350} y={410}
          click={() => props.setOption(options.PENALTY, !penalty)}
          hide={hide}
          value={penalty}></Checkbox>
      </Set>
    </Set>
  )
}

export default Options;
