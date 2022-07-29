import React from 'react';
import './IDEMainContent.css';
class IDEMainContent extends React.Component {
    render() {
      return <div className='ide-maincontent'>
        {this.props.children}
      </div>;
    }
  }
  export default IDEMainContent;