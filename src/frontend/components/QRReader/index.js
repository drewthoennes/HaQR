import React from 'react';
import Reader from 'react-qr-reader';

export default class QRReader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      delay: 500,
      result: 'No result',
    }

    this.handleScan = this.handleScan.bind(this)
  }

  handleScan(data) {
    if (data) {
      this.props.onScan(data);
    }
  }

  render() {
    const previewStyle = {
      height: 320,
      width: 320,
    };

    return(
      <div className="qrReader">
        <Reader
          delay={this.state.delay}
          style={previewStyle}
          onScan={this.handleScan}
          onError={this.props.onError}
          />
      </div>
    );
  }
}
