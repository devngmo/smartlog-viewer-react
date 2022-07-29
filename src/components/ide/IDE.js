import React from 'react';

import './IDE.css';
class IDE extends React.Component {
    render() {
      return <div className="ide">
        {this.props.children}
      </div>;
    }
  }
  export default IDE;