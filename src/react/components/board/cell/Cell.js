import React from 'react'
import { Set, Rect, Text } from 'react-raphael';

import Notes from './Notes.container';

class Cell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      highlighted: false
    };
  }

  onClick() {
    if (this.props.isActive) {
      this.props.selectCell();
    }
  }

  toggleHighlight() {
    if (this.props.isActive === undefined || this.props.isActive && this.props.isActive) {
      this.setState(prevState => ({ highlighted: !prevState.highlighted }));
    }
  }

  render() {
    return (
      <Set>
        <Rect width={this.props.width} height={this.props.height}
          x={this.props.width * this.props.col + 3 + this.props.offsetX}
          y={this.props.height * this.props.row + this.props.height + this.props.offsetY}
          attr={{ class: `board cell bg${this.getRectCssClasses()}`}} />
        <Text text={this.props.value && this.props.value > 0 ? this.props.value.toString() : ''}
          x={this.props.width * this.props.col + 3 + (this.props.width / 2) + (this.props.offsetX || 0)}
          y={this.props.height * this.props.row + this.props.height + (this.props.height / 2) + (this.props.offsetY || 0)}
          attr={{ class: `board cell text${this.getTextCssClasses()}` }} />

        <Notes index={this.props.index}
          width={this.props.width}
          row={this.props.row} col={this.props.col}
          x={this.props.width * this.props.col + (this.props.offsetx || 0)}
          y={this.props.height * this.props.row + (this.props.offsetY || 0) + this.props.height}
          hide={this.props.prepopulated || !this.props.isActive} />

        {/* Rect to capture events and highlight for entire cell */}
        <Rect width={this.props.width} height={this.props.height}
          x={this.props.width * this.props.col + 3 + this.props.offsetX}
          y={this.props.height * this.props.row + this.props.height + this.props.offsetY}
          attr={{ class: `board cell overlay${!this.props.isActive ? ' inactive' : ''}` }}
          click={this.onClick.bind(this)}
          mouseover={this.toggleHighlight.bind(this)}
          mouseout={this.toggleHighlight.bind(this)} />

        {/* Delete Button */}
        <Text text={'X'}
          x={this.props.width * this.props.col + this.props.width + this.props.offsetX - 5}
          y={this.props.height * this.props.row + this.props.height + this.props.offsetY + 10}
          attr={{ class: `board cell text delete` }}
          click={() => this.props.setCell(0)}
          hide={!this.props.selected || this.props.prepopulated || !this.props.isActive || (this.props.value === 0 || !this.props.hasNotes)} />
      </Set>
    );
  }

  getRectCssClasses() {
    let classes = '';

    if (this.props.class) {
      classes += ` ${this.props.class}`;
    }

    if (this.state.highlighted) {
      classes += ` highlight`;
    }

    if (this.props.selected && this.props.isActive) {
      classes += ` selected`;
    }

    if (!this.props.isActive) {
      classes += ` inactive`;
    }

    return classes;
  }

  getTextCssClasses() {
    let classes = '';

    if (this.props.class) {
      classes += ` ${this.props.class}`;
    }

    if (this.props.prepopulated && this.props.isActive) {
      classes += ` prepopulated`;
    }

    return classes;
  }
}

export default Cell;
