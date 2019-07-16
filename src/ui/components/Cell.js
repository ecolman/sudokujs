import React from 'react'
import { Set, Rect, Text } from 'react-raphael';

class Cell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      highlighted: false
    };
  }

  toggleHighlight() {
    if (this.props.isActive === undefined || this.props.isActive && this.props.isActive) {
      this.setState(prevState => ({ highlighted: !prevState.highlighted }));
    }
  }

  render() {
    return (
      <Set>
        <Rect ref={`cell-bg-${this.props.index}`}
          x={this.props.width * this.props.col + 3 + this.props.offsetX}
          y={this.props.height * this.props.row + this.props.height + this.props.offsetY}
          width={this.props.width}
          height={this.props.height}
          attr={{ class: `cell__bg${this.props.class ? ` ${this.props.class}` : ''}${this.state.highlighted ? ' highlight' : ''}` }} />
        <Text ref={`cell-text-${this.props.index}`}
          x={this.props.width * this.props.col + 3 + (this.props.width / 2) + this.props.offsetX}
          y={this.props.height * this.props.row + this.props.height + (this.props.height / 2) + this.props.offsetY}
          text={this.props.value && this.props.value > 0 ? this.props.value.toString() : ''}
          attr={{ class: `cell__text${this.props.class ? ` ${this.props.class}` : ''}${this.props.prepopulated ? ' prepopulated' : ''}` }} />

        {/* Rect to capture events and highlight for entire cell */}
        <Rect ref={`cell-overlay-${this.props.index}`}
          x={this.props.width * this.props.col + 3 + this.props.offsetX}
          y={this.props.height * this.props.row + this.props.height + this.props.offsetY}
          width={this.props.width}
          height={this.props.height}
          attr={{ class: `cell__overlay${!this.props.isActive ? ' inactive' : ''}` }}
          click={() => this.props.isActive && !this.props.prepopulated ? this.props.onClick() : null}
          mouseover={this.toggleHighlight.bind(this)}
          mouseout={this.toggleHighlight.bind(this)} />
      </Set>
    );
  }
}

export default Cell;
