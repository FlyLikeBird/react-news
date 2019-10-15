import React from 'react';

import { Row, Col } from 'antd';

import PCNewsBlock from '../pc_news_block';
import PCSearchContent from './pc_search_content';

export default class PCSearchContainer extends React.Component{
  constructor(){
    super();
    
  }

  
  render(){

    return(
      
      <section style={{paddingTop:'40px'}}>
        <Row>
          <Col span={2}></Col>
          <Col span={5} className="container">
              {/*<PCNewsBlock type="top" count={20} width="100%" title="相关新闻" /> */}

          </Col>
          <Col span={15}>
              <PCSearchContent {...this.props}/>
          </Col>
          <Col span={2}></Col>
        </Row>
      </section>
    )
  }
}


