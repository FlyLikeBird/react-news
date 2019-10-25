import React from 'react';

import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin, Badge } from 'antd';
import TopicContainer from './pc_topic_container';
const { Meta } = Card;

export default class PCTopicIndex extends React.Component{
    
    
    render(){
        console.log(this.props);

        return(

            
                <Row style={{paddingTop:'30px',textAlign:'left'}}>
                    <Col span={2}></Col>
                    <Col span={4}></Col>                                      
                    <Col span={16}>
                        <TopicContainer {...this.props}/>
                    </Col>
                    
                    <Col span={2}></Col>
                </Row>
           
        )
    }
}


