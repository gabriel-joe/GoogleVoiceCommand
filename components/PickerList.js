import * as React from 'react';
import { Picker } from 'react-native';

export class PickerList extends React.Component {

  render() {
      return <Picker
                selectedValue={this.props.selectedValue}
                style={{ height: this.getDefaultHeight(), width: this.getDefaultWidth() }}
                onValueChange={this.props.onValueChange}>
                { this.props.items }
             </Picker>;
  }

  getDefaultHeight() {
      if(this.props.height != null) {
          return this.props.height
      } 
      return 50
  }

  getDefaultWidth() {
      if(this.props.width != null) {
          return this.props.width
      } 
      return 100
  }
}


