import React, { useEffect } from 'react';
import { Button, ListGroup, Nav, Navbar, NavItem } from 'react-bootstrap';
import IssueItem from './IssueItem';
import moment from 'moment';
import './IssueTrackerView.css';
class IssueTrackerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullLog: [],
      issues: [],
      minTime : moment('2020-01-01')
    };
  }

  reloadIssueList() {
    let ins = this;
    fetch('http://10.71.44.149:8000/log/mw2')
    .then(resp => resp.json())
    .then(data => {
      console.log(`fetched ${data.length} issues`);
      console.log(data);
      ins.state.fullLog = data;
      ins.applyFilter();
    });
  }

  applyFilter() {
    let issues = [];
    let ins = this;
    ins.state.fullLog.forEach(x => {
      let m2 = moment(x.time);
      let duration = moment.duration(ins.state.minTime.diff(m2));
      console.log(`duration from now with ${m2.format('DD/MM/YYYY hh:mm:ss')} is ${duration.get('seconds')} seconds`);
      if (m2.isAfter(ins.state.minTime)) {
        issues.push(x);
      }
    });
    console.log(`filtered ${issues.length} entries`);
    ins.setState({      
      issues: issues
    });
  }

  componentDidMount() {
    this.reloadIssueList();
    setInterval(function() {
      this.reloadIssueList();
    }.bind(this), 10000);
  }

  cutLog() {
    this.setState({
      minTime: moment(Date.now())
    });
    this.reloadIssueList();
  }
     
    render() {
      var i = 0;
      return <div className='itv-listview'>
        <div>
          <Button onClick={() => this.cutLog()}>Cut</Button>
        </div>
        <ListGroup>
          {
            
            this.state.issues.map(item => (
              <IssueItem key={i++} issue={item}></IssueItem>
            ))
          }
        </ListGroup>
      </div>;
    }
  }
  export default IssueTrackerView;  