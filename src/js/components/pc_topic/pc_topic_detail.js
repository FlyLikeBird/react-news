import React from 'react';

import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin, Badge } from 'antd';
import TopicDetailContainer from './pc_topic_detail_container';
import PCFooter from '../pc_footer';

const { Meta } = Card;


export default class PCTopicDetail extends React.Component{
    
    render(){
        
        return(

            <div>
                
                <Row style={{paddingTop:'30px'}}>
                    <Col span={2}></Col>
                    <Col span={4}></Col>                                      
                    <Col span={16}>
                        <TopicDetailContainer {...this.props}/>
                    </Col>
                    
                    <Col span={2}></Col>
                </Row>
                <PCFooter/>
            </div>
            
            
                       
        )
    }
}


