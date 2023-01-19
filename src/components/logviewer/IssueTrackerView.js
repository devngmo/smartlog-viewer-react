import React, { useEffect } from 'react';
import { Button, ListGroup, Nav, Navbar, NavItem } from 'react-bootstrap';
import IssueItem from './IssueItem';
import moment from 'moment';
import './IssueTrackerView.css';
import { LogAPI } from '../../api/logapi';
import LogFilter from './LogFilter';

class IssueTrackerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: props.active,
      name: props.name,
      fullLog: [],
      issues: [],
      minTime : moment('2020-01-01'),
      filterTags: [],
      filterVerboses: ['i', 'd', 'w', 'e'],
      applications: ['mw2', 'odm-react'],
      selectedAppID: 'mw2',
      loading : false
    };

    console.log(`IssueTrackerView-${this.state.name} init state selectedAppID ${this.state.selectedAppID}`);
  }

  reloadIssueList() {
    if (!this.state.active) {
      return;
    }
    console.log(`ITV-${this.state.name}: reload issues for app [${this.state.selectedAppID}]...`);
    let ins = this;
    if (this.state.loading) return;
    ins.setState({loading:true});
    LogAPI.getAllLog(this.state.selectedAppID, (data) => {
      console.log(`fetched ${data.length} issues`);
      //console.log(data);
      ins.state.fullLog = data;
      ins.applyFilter();
      ins.setState({loading:false});
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
    console.log(`ITV-${this.state.name}: mount`);
    let ins = this;
    ins.reloadIssueList();
    setInterval(function() {      
      ins.reloadIssueList();
    }, 10000);
  }

  cutLog() {
    this.setState({
      minTime: moment(Date.now())
    });
    this.reloadIssueList();
  }

  handleFilterTagsChanged(tags) {
    this.setState({filterTags: tags});
    console.log(`ITV-${this.state.name}: tags: ${this.state.filterTags.join('|')}`);
  }

  handleFilterVerboseFlagChanged(selectedVerboses) {
    this.setState({filterVerboses: selectedVerboses});
  }

  handleOnAppChanged(appID) {
    this.setState({selectedAppID: appID});
    let ins = this;
    setTimeout(() => {
      ins.reloadIssueList();
    }, 100);    
  }
  matchVerboseFilter(item) {
    if (this.state.filterVerboses.length === 0) return true;
    return this.state.filterVerboses.includes(item.v);
  }

  matchTagFilter(item) {
    if (this.state.filterTags.length === 0) return true;
    if (this.state.filterTags.includes(item.m)) return true;
    if (item.tags === null ||item.tags === undefined) return false;
    for(let i = 0; i< item.tags.length; i++) {
      for(let k = 0; k < this.state.filterTags.length; k++) {
        if (item.tags[i].startsWith(this.state.filterTags[k])) return true;
      }      
    }
    return false;
  }
    
    render() {

      let filteredItems = [];
      for(let i = 0; i < this.state.issues.length; i++) {
        let item = this.state.issues[i];
        if (!this.matchTagFilter(item)) {
          console.log(`ignore tags: ${item.tag}`);
          continue;
        }
        if (item.ex === 'fail') {

        }
        else if (item.evt !== undefined) {

        }
        else if (!this.matchVerboseFilter(item)) {
          console.log(`ignore verbose: ${item.v}`);
          continue;
        }

        //console.log(`show ${item.msg}`);
        filteredItems.push(<IssueItem key={i} issue={item}></IssueItem>);
      }


      
      return <div className='itv-listview'>
        <LogFilter
          selectedAppID={this.state.selectedAppID}
          applications={this.state.applications}
          filterTags={this.state.filterTags}
          verboseFlags={this.state.filterVerboses}
          onFilterVerboseFlagChanged={(selectedVerboses) => this.handleFilterVerboseFlagChanged(selectedVerboses)}
          onFilterTagsChanged={(tags) => this.handleFilterTagsChanged(tags)}
          onAppChanged={(appID) => this.handleOnAppChanged(appID)}
        ></LogFilter>
        <ListGroup>
          {filteredItems}
        </ListGroup>
      </div>;
    }
  }
  export default IssueTrackerView;  