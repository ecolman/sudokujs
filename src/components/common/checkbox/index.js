import React, { useRef } from 'react';
import { Set, Raphael, Rect, Path } from 'react-raphael';

import { FADES_MS } from 'components/constants';

import './styles.less'

function Checkbox({ animate, click, cssClass, hide, value, x, y }) {
  let isLoaded = useRef(false);
  const elToFront = el => {
    if (!hide) {
      el.show();
      el.toFront();
    } else {
      el.hide()
    }
  };
  const checkAnimation = isLoaded.current
    ? value && !hide
      ? Raphael.animation({ opacity: 1 }, FADES_MS.FAST, function() { this.show(); })
      : Raphael.animation({ opacity: 0 }, FADES_MS.FAST, function() { this.hide(); })
    : Raphael.animation({ opacity: 0 }, 0, function() { this.hide(); });

  isLoaded.current = true;

  return (
    <Set>
      <Rect x={x} y={y}
        r={5} rx={5} ry={5}
        width={28} height={28}
        styleName={'box'}
        animate={animate}
        click={click}
        update={elToFront}></Rect>
      <Path d={'M 197.67968,534.31563 C 197.40468,534.31208 196.21788,532.53719 195.04234,530.37143 L 192.905,526.43368 L 193.45901,525.87968 C 193.76371,525.57497 194.58269,525.32567 195.27896,525.32567 L 196.5449,525.32567 L 197.18129,527.33076 L 197.81768,529.33584 L 202.88215,523.79451 C 205.66761,520.74678 208.88522,517.75085 210.03239,517.13691 L 212.11815,516.02064 L 207.90871,520.80282 C 205.59351,523.43302 202.45735,527.55085 200.93947,529.95355 C 199.42159,532.35625 197.95468,534.31919 197.67968,534.31563 z'}
        transform={[`t${x - 182},${-345 + y - 170}s1.5`]}
        styleName={`check${cssClass ? ` ${cssClass}` : ''}`}
        animate={checkAnimation}
        click={click}
        update={elToFront}></Path>
    </Set>
  );
}

export default Checkbox;
