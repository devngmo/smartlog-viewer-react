import React from 'react';
import './IssueItem.css';
import Moment from 'react-moment';

function beautyData(data) {
    try {   
        return JSON.stringify(data, null, 4);
    }catch(err) {
        return data;
    }
}
class IssueItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showData: false
        };
    }


    toogleShowData() {
        this.setState({showData: !this.state.showData});
    }

    

    render() {
        let data = '';
        if (this.state.showData) {
            if (this.props.issue.data !== undefined && this.props.issue.data !== null) {
                data = JSON.stringify(this.props.issue.data, null, 4);
            }
        }
      return <div 
        className={'issue-item ' + this.props.issue.v + (this.state.showData?' show-data':'')} onClick={() => this.toogleShowData()}>
        <div className='msg'>
            <span className="tag">{this.props.issue.tag}</span> {this.props.issue.msg}            
        </div>
        <div prep="code">{data}</div>
        <Moment date={this.props.issue.time} format="DD-MM-YYYY hh:mm:ss"></Moment>
      </div>;
    }
  }
  export default IssueItem;