import React from 'react';
import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin, Badge } from 'antd';
import TopicDetailContainer from './pc_topic_detail_container';
import Sidebar from '../../side_bar';

export default class PCTopicDetail extends React.Component{
    
    render(){
        
        return(
             
            <Row style={{paddingTop:'30px',textAlign:'left'}}>
                <Col span={2}></Col>
                <Col span={5}><Sidebar /></Col>                                      
                <Col span={15} style={{paddingLeft:'50px'}}>
                    <TopicDetailContainer {...this.props}/>
                </Col>
                
                <Col span={2}></Col>
            </Row>
                
                       
        )
    }
}


