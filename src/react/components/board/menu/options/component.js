import React from 'react'
import { Path, Raphael, Set, Text } from 'react-raphael';

import { penaltyMs } from '../../../../../game/constants';

import Checkbox from '../../../common/checkbox';
import './styles.less';

function Options(props) {
  const hide = !props.optionsVisible;
  let animation = Raphael.animation({ opacity: hide ? 0 : .7 }, 300);

  return (
    <Set>
      {/* Back Button */}
      <Set>
        <Text text={'Save Options'}
          x={70} y={25}
          animate={animation}
          styleName={'save text'}
          click={() => props.setOption(props.options.VISIBLE, false)}
          hide={hide}></Text>
        <Path d={'M 15 15 l 0 20 l -10 -10 z'}
          styleName={'save path'}
          animate={animation}
          click={() => props.setOption(props.options.VISIBLE, false)}
          hide={hide}></Path>
      </Set>

      {/* Timer */}
      <Set>
        <Text text={'Enable Timer'}
          x={270} y={175}
          styleName={'option'}
          click={() => props.setOption(props.options.TIMER, !props.timer)}
          hide={hide}
          update={el => { el.toFront(); } }></Text>
        <Checkbox
          x={350} y={160}
          hide={hide}
          click={() => props.setOption(props.options.TIMER, !props.timer)}
          value={props.timer}></Checkbox>
      </Set>

      {/* Highlighting */}
      <Set>
        <Text text={'Number highlighting'}
          x={232} y={225}
          styleName={`option`}
          click={() => props.setOption(props.options.HIGHLIGHTING, !props.highlighting)}
          hide={hide}
          update={el => { el.toFront(); } }></Text>
        <Checkbox
          x={350} y={210}
          click={() => props.setOption(props.options.HIGHLIGHTING, !props.highlighting)}
          hide={hide}
          value={props.highlighting}></Checkbox>
      </Set>

      {/* Notes */}
      <Set>
        <Text text={'Auto Remove Notes'}
          x={244} y={275}
          styleName={`option`}
          click={() => props.setOption(props.options.REMOVE_NOTES, !props.removeNotes)}
          hide={hide}
          update={el => { el.toFront(); } }></Text>
        <Checkbox
          x={350} y={260}
          click={() => props.setOption(props.options.REMOVE_NOTES, !props.removeNotes)}
          hide={hide}
          value={props.removeNotes}></Checkbox>
      </Set>

      {/* Number First */}
      <Set>
        <Text text={'Select Number First'}
          x={233} y={325}
          styleName={`option`}
          click={() => props.setOption(props.options.NUMBER_FIRST, !props.numberFirst)}
          hide={hide}
          update={el => { el.toFront(); } }></Text>
        <Text text={'(instead of selecting cell and then number)'}
          x={180} y={343}
          styleName={`option description`}
          click={() => props.setOption(props.options.NUMBER_FIRST, !props.numberFirst)}
          hide={hide}
          update={el => { el.toFront(); } }></Text>
        <Checkbox
          x={350} y={310}
          click={() => props.setOption(props.options.NUMBER_FIRST, !props.numberFirst)}
          hide={hide}
          value={props.numberFirst}></Checkbox>
      </Set>

      {/* Instant Feedback */}
      <Set>
        <Text text={'Instant Feedback'}
          x={248} y={378}
          styleName={`option`}
          click={() => props.setOption(props.options.FEEDBACK, !props.feedback)}
          hide={hide}
          update={el => { el.toFront(); } }></Text>
        <Checkbox
          x={350} y={360}
          click={() => props.setOption(props.options.FEEDBACK, !props.feedback)}
          hide={hide}
          value={props.feedback}></Checkbox>
      </Set>

      {/* Penalty */}
      <Set>
        <Text text={'Penalty for wrong number'}
          x={206} y={425}
          styleName={`option`}
          click={() => props.setOption(props.options.PENALTY, !props.penalty)}
          hide={hide}
          update={el => { el.toFront(); } }></Text>
        <Text text={`(+${penaltyMs / 1000} seconds, when instant feedback enabled)`}
          x={180} y={440}
          styleName={`option description`}
          click={() => props.setOption(props.options.PENALTY, !props.penalty)}
          hide={hide}
          update={el => { el.toFront(); } }></Text>
        <Checkbox
          x={350} y={410}
          click={() => props.setOption(props.options.PENALTY, !props.penalty)}
          hide={hide}
          value={props.penalty}></Checkbox>
      </Set>
    </Set>
  )
}

export default Options;
