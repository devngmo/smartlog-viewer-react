import React, { usestate, Component }  from 'react';
import IDE from '../ide/IDE.js';
import IDEMainContent from '../ide/IDEMainContent';
import IDESidebar from '../ide/IDESidebar';
import {Tab, Tabs} from 'react-bootstrap';
import IssueTrackerView from './IssueTrackerView.js';

class LogViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabID: 'issue-tracker'
    };
  }
    
    render() {
      return <IDE>
        {/* <IDESidebar></IDESidebar> */}
        <IDEMainContent>
          <Tabs
            activeKey={this.state.tabID}
            onSelect={(k) => this.state.tabID=k}
          >
            <Tab eventKey="issue-tracker" title="Issue Tracker">
              <IssueTrackerView active={this.state.tabID=='issue-tracker'} name="issue-only"></IssueTrackerView>
            </Tab>
            <Tab eventKey="full-log" title="Full Log">
            <IssueTrackerView active={this.state.tabID=='full-log'} name="full-log"></IssueTrackerView>
            </Tab>
          </Tabs>

  
 
        </IDEMainContent>
      </IDE>;
    }
  }
  export default LogViewer;  