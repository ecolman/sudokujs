import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Raphael, Set, Rect, Text, Utils } from 'react-raphael';
import { forEach } from 'lodash';

import { selectors as gameSelectors } from 'redux/game';

import classes from './styles.less';

// taken from https://codepen.io/anon/pen/dmEMdO
function Loader() {
  const setRef = useRef(null);
  const isLoading = useSelector(gameSelectors.isLoading);

  const elToFront = el => el.toFront();
  let box = null;

  const ww = window.innerWidth;
  const wh = window.innerHeight;
  const g = [272, 220];
  const size = wh - 158;

  const dots = [[g[0], g[1] - size / 4], [g[0] + size / 2 / Math.sqrt(3), g[1] + size / 4], [g[0] - size / 2 / Math.sqrt(3), g[1] + size / 4], [g[0], g[1] - size / 4]];
  const tPath = `M${dots[0][0]},${dots[0][1]}L${dots[1][0]},${dots[1][1]}L${dots[2][0]},${dots[2][1]}Z`;
  const pathCssClasses = `${classes.path}`;

  let triangle;
  let triangle2;

  let triangle3 = [];
  let triangle4 = [];
  let triangle4_2 = [];

  let box2 = [];
  let count = 0;
  let count2 = 0;
  let loop = null;

  useEffect(() => {
    if (1 == 2 && isLoading) {
      setTimeout(start);

      loop = setTimeout(reset, 5000);
    }

    return () => clearTriangles();
  }, [isLoading]);

  function start() {
    if (setRef.current && setRef.current.set) {
      triangle = Utils.createElement(setRef.current.set.id, 'path', { d: tPath, className: pathCssClasses });
      box = triangle.getBBox();

      triangle2 = Utils.createElement(setRef.current.set.id, 'path', { d: tPath, className: pathCssClasses });
      triangle2.animate({ transform: `R60,${g[0]},${(box.y + box.height / 1.5)}` }, Math.random() * 1000 + 1000, 'bounce', third);
    }
  }

  function reset() {
    clearTriangles();

    start();

    loop = setTimeout(reset, 5000);
  }

  function clearTriangles() {
    if (setRef.current && setRef.current.set) {
      forEach(setRef.current.set, el => {
        if (el.type === 'path') {
          el.stop();
          el.remove();
        }
      });
    }

    count = 0;
    count2 = 0;

    loop = clearTimeout(loop);
  }

  function third() {
    if (setRef.current && setRef.current.set) {
      for (let i = 0; i < 6; i++) {
        triangle3[i] = Utils.createElement(setRef.current.set.id, 'path', { d: tPath, className: pathCssClasses });
        triangle3[i].transform(`s${1/3}t0,-${box.height}R${60 * i},${box.cx},${(box.y + box.height / 1.5)}`);
        let sbox = triangle3[i].getBBox();

        if (i % 2 == 0) {
          triangle3[i].animate({ transform: `...R60,${sbox.cx},${(sbox.y + sbox.height / 1.5)}` }, 600, 'bounce', fourth);
        } else {
          triangle3[i].animate({ transform: `...R60,${sbox.cx},${(sbox.y + sbox.height / 3)}` }, 800, 'bounce', fourth2);
        }
      }
    }
  }

  function fourth(j) {
    if (setRef.current && setRef.current.set) {
      for (let i = 0; i < 6; i++) {
        box2[this.id] = this.getBBox();
        triangle4[i] = Utils.createElement(setRef.current.set.id, 'path', { d: tPath, className: pathCssClasses });
        triangle4[i].transform(`s${1/9}t0,-${box.height * 4}R${120 * count},${g[0]},${(box.y + box.height / 1.5)}R${60 * i},${box2[this.id].cx},${(box2[this.id].y + box2[this.id].height / 3)}`);
        let sbox = triangle4[i].getBBox();

        if(i % 2 == 0) {
          triangle4[i].animate({ transform: `...R60,${sbox.cx},${(sbox.y + sbox.height / 1.5)}` }, Math.random() * 1200 + 700, 'bounce');
        } else {
          triangle4[i].animate({ transform: `...R60,${sbox.cx},${(sbox.y + sbox.height / 3)}` }, Math.random() * 1200 + 700, 'bounce');
        }
      }

      count++;
    }
  }

  function fourth2(j) {
    if (setRef.current && setRef.current.set) {
      for (let i = 0; i < 6; i++) {
        box2[j] = this.getBBox();
        triangle4_2[i] = Utils.createElement(setRef.current.set.id, 'path', { d: tPath, className: pathCssClasses });
        triangle4_2[i].transform(`s${1/9}t0,-${box.height * 4}R${120 * count2 + 60},${g[0]},${(box.y + box.height / 1.5)}R${60 * i},${box2[j].cx},${(box2[j].y + box2[j].height / 1.5)}`);
        let sbox = triangle4_2[i].getBBox();

        if (i % 2 == 0) {
          triangle4_2[i].animate({ transform: `...R60,${sbox.cx},${(sbox.y + sbox.height / 3)}` }, Math.random() * 1200 + 700, 'bounce');
        } else {
          triangle4_2[i].animate({ transform: `...R60,${sbox.cx},${(sbox.y + sbox.height / 1.5)}` }, Math.random() * 1200 + 700, 'bounce');
        }
      }

      count2++;
    }
  }

  return (
    <Set ref={setRef}>
      {isLoading && (
        <>
          <Rect width={540} height={450}
            x={3} y={50}
            styleName={`container`}
            load={elToFront} update={elToFront} />

          <Text text={'Generating Puzzle'}
            x={270} y={270}
            styleName={'text'}
            load={elToFront} update={elToFront} />
        </>
      )}
    </Set>
  )
}

export default Loader;
