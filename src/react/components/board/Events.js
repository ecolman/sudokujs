import React from 'react';

import { getRowColumn } from '../../../game/utilities';

class Events extends React.Component {
  constructor(props) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentWillMount(){
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnMount(){
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown(event) {
    if (this.props.active) {
      const key = event.charCode || event.keyCode || 0;

      if (key >= 49 && key <= 57 || key >= 97 && key <= 105) {
        // 1 - 9, add number to board
        const cellRowCol = getRowColumn(this.props.selectedCell);
        const keyDiff = key >= 49 && key <= 57 ? 48 : 96;
        const num = key - keyDiff;
        const prepopulated = !this.props.baseBoard.checkCell(cellRowCol.row, cellRowCol.col, 0);

        if (!prepopulated) {
          if (this.props.notesMode) {
            if (this.props.notesBoard[this.props.selectedCell].indexOf(num) > -1) {
              this.props.deleteNote(cellRowCol.row, cellRowCol.col, num)
            } else {
              this.props.addNote(cellRowCol.row, cellRowCol.col, num)
            }
          } else {
            this.props.setCell(cellRowCol.row, cellRowCol.col, num)
          }
        }
      } else if (key >= 37 && key <= 40) {  // arrow keys
        let cellIndex = this.props.selectedCell;

        switch (key) {
          case 37:  // left
            cellIndex--;
            break;

          case 38:  // up
            cellIndex -= 9;
            break;

          case 39:  // right
            cellIndex++;
            break;

          case 40:  // down
            cellIndex += 9;
            break;
        }

        if (cellIndex >= 0 && cellIndex <= 80 && cellIndex !== this.props.selectedCell) {
          this.props.selectCell(cellIndex);
        }
      } else if (key === 8 || key === 46) {
        const cellRowCol = getRowColumn(this.props.selectedCell);
        const prepopulated = !this.props.baseBoard.checkCell(cellRowCol.row, cellRowCol.col, 0);

        if (!prepopulated) {
          this.props.clearCell(cellRowCol.row, cellRowCol.col);
        }
      }
    }
  }

  render() {
    return null;
  }
}

export default Events;
