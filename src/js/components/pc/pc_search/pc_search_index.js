import React from 'react';
import { Row, Col } from 'antd';
import PCSearchContainer from './pc_search_container';
import Sidebar from '../../side_bar';

export default class PCSearchIndex extends React.Component{
  
  render(){
    
    return(
      
      <section style={{paddingTop:'30px'}}>
        <Row>
          <Col span={2}></Col>
          <Col span={5} className="container"><Sidebar/></Col>
          <Col span={15}><PCSearchContainer {...this.props}/></Col>
          <Col span={2}></Col>
        </Row>
      </section>
    )
  }
}


