



import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';

import PCIndex from './js/components/pc_index';
import PCNewsDetails from './js/components/pc_detail';
import PCUserCenter from './js/components/pc_usercenter';

import MediaQuery from 'react-responsive';



import MobileIndex from './js/components/mobile_index';
import MobileNewsDetails from './js/components/mobile_detail';
import MobileUserCenter from './js/components/mobile_usercenter';



import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

//import 'antd/dist/antd.css';

import './css/pc.css';
import './css/mobile.css';


export default class Root extends React.Component {
    render(){
        
        return (
            <div>
              <MediaQuery query='(min-device-width:1224px)'>
                <Router>
                  <div>
                      <Route path="/" component={PCIndex}></Route>
                      <Route path="/details/:uniquekey" component={PCNewsDetails}></Route>
                      <Route path="/usercenter" component={PCUserCenter}></Route>
                  </div>
                </Router>
                
              </MediaQuery>


              
            
            </div>
            
            
        )
    }
}


/*

<MediaQuery query='(max-device-width:1224px)'>
                <Router>
                  <div>
                     <Route path="/" component={MobileIndex}></Route>
                     <Route path="/details/:uniquekey" component={MobileNewsDetails}></Route>
                     <Route path="/usercenter" component={MobileUserCenter}></Route>
                  </div>
                </Router>
              </MediaQuery>

*/


ReactDOM.render(
    <Root/>,
    document.getElementById('mainContainer')
)






