import React, { useEffect } from 'react';
import { Button, ListGroup, Nav, Navbar, NavItem } from 'react-bootstrap';
import IssueItem from './IssueItem';
import moment from 'moment';
import './IssueTrackerView.css';
import { LogAPI } from '../../api/logapi';
import LogFilter from './LogFilter';

const APP_ID = 'odm-react';

class IssueTrackerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullLog: [],
      issues: [],
      minTime : moment('2020-01-01'),
      filterTags: [],
      filterVerboses: ['i', 'd', 'w', 'e'],
    };
  }

  reloadIssueList() {
    let ins = this;
    LogAPI.getAllLog(APP_ID, (data) => {
      //console.log(`fetched ${data.length} issues`);
      //console.log(data);
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
      //console.log(`duration from now with ${m2.format('DD/MM/YYYY hh:mm:ss')} is ${duration.get('seconds')} seconds`);
      if (m2.isAfter(ins.state.minTime)) {
        issues.push(x);
      }
    });
    //console.log(`filtered ${issues.length} entries`);
    ins.setState({      
      issues: issues
    });
  }

  componentDidMount() {
    console.log("ITV: mount");
    this.reloadIssueList();
    // setInterval(function() {
    //   this.reloadIssueList();
    // }.bind(this), 10000);
  }

  cutLog() {
    this.setState({
      minTime: moment(Date.now())
    });
    this.reloadIssueList();
  }

  handleFilterTagsChanged(tags) {
    this.setState({filterTags: tags});
    console.log(`ITV: tags: ${this.state.filterTags.join('|')}`);
  }

  handleFilterVerboseFlagChanged(selectedVerboses) {
    this.setState({filterVerboses: selectedVerboses});
  }
    
    render() {
      let filteredItems = [];
      console.log(`tag length: ${this.state.filterTags.length} verboses length: ${this.state.filterVerboses.length}`);
      for(let i = 0; i < this.state.issues.length; i++) {
        let item = this.state.issues[i];
        if (this.state.filterTags.length > 0 && !this.state.filterTags.includes(item.tag)) {
          console.log(`ignore tags: ${item.tag}`);
          continue;
        }
        if (this.state.filterVerboses.length > 0 && !this.state.filterVerboses.includes(item.v)) {
          console.log(`ignore verbose: ${item.v}`);
          continue;
        }

        //console.log(`show ${item.msg}`);
        filteredItems.push(<IssueItem key={i} issue={item}></IssueItem>);
      }
      
      return <div className='itv-listview'>
        <LogFilter
          filterTags={this.state.filterTags}
          verboseFlags={this.state.filterVerboses}
          onFilterVerboseFlagChanged={(selectedVerboses) => this.handleFilterVerboseFlagChanged(selectedVerboses)}
          onFilterTagsChanged={(tags) => this.handleFilterTagsChanged(tags)}
        ></LogFilter>
        <ListGroup>
          {filteredItems}
        </ListGroup>
      </div>;
    }
  }
  export default IssueTrackerView;  