import React from 'react';

import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin, Badge } from 'antd';
import TopicListContainer from './pc_topic_list_container';
const { Meta } = Card;

export default class PCTopicIndex extends React.Component{  
    render(){
        return(

            
                <Row style={{paddingTop:'30px',textAlign:'left'}}>
                    <Col span={2}></Col>
                    <Col span={4}></Col>                                      
                    <Col span={16}>
                        <TopicListContainer {...this.props}/>
                    </Col>
                    
                    <Col span={2}></Col>
                </Row>
           
        )
    }
}


