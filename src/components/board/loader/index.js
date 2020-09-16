import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Raphael, Set, Rect, Paper, Text, Utils } from 'react-raphael';

import { selectors as gameSelectors } from 'redux/game';

import classes from './styles.less';

// taken from https://codepen.io/thgaskell/pen/KmRjOx
function Loader() {
  const isLoading = useSelector(gameSelectors.isLoading);
  const elToFront = el => setTimeout(() => el.toFront());

  useEffect(() => {
    if (Utils.papers.length === 1) {
      const paper = Utils.papers[0];

      paper.defs.innerHTML = `<linearGradient id="loader-gradient-fill" gradientUnits="userSpaceOnUse" x1="0" y1="300" x2="300" y2="0">
        <stop offset="0%">
          <animate attributeName="stop-color" values="#00E06B;#CB0255;#00E06B" dur="5s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%">
          <animate attributeName="stop-color" values="#04AFC8;#8904C5;#04AFC8" dur="8s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
      <clipPath id="loader-clip">
        <rect class="${classes.square} ${classes.s1}" x="0" y="0" rx="12" ry="12" height="90" width="90"></rect>
        <rect class="${classes.square} ${classes.s2}" x="100" y="0" rx="12" ry="12" height="90" width="90"></rect>
        <rect class="${classes.square} ${classes.s3}" x="200" y="0" rx="12" ry="12" height="90" width="90"></rect>
        <rect class="${classes.square} ${classes.s4}" x="0" y="100" rx="12" ry="12" height="90" width="90"></rect>
        <rect class="${classes.square} ${classes.s5}" x="200" y="100" rx="12" ry="12" height="90" width="90"></rect>
        <rect class="${classes.square} ${classes.s6}" x="0" y="200" rx="12" ry="12" height="90" width="90"></rect>
        <rect class="${classes.square} ${classes.s7}" x="100" y="200" rx="12" ry="12" height="90" width="90"></rect>
      </clipPath>`;
    }
  });

  function loaded(el) {
    if (el?.node) {
      el.node.setAttribute('clip-path', "url('#loader-clip')");
    }

    elToFront(el);
  }

  return (isLoading &&
    <Set>
      <Rect width={540} height={450}
        x={3} y={50}
        styleName={`opacity`}
        load={elToFront} update={elToFront} />
      <Rect width={300} height={300} styleName={'gradient'} load={loaded} update={elToFront} />
      <Text text={'Generating Board'}
        x={275} y={125}
        styleName={'text'}
        load={elToFront} update={elToFront} />
    </Set>

  );
}

export default Loader;
