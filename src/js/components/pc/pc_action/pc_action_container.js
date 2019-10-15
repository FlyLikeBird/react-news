import React from 'react';
import {  Row, Col, Spin  } from 'antd';

import UpdateItem from '../pc_usercenter/pc_usercenter_update_item';
import PCFooter from '../pc_footer';

export default class PCActionContainer extends React.Component{
    constructor(){
        super();
        this.state = {
            data:{},
            isLoad:true
        }
    }

    componentDidMount(){
        var uniquekey = this.props.match.params.id;
        
        fetch(`/action/getActionContent?contentId=${uniquekey}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                this.setState({data,isLoad:false});
            })
        
    }

    render(){
       var { isLoad, data } = this.state;
       
        return(
            
            <div>               
                <Row style={{paddingTop:'30px'}}>
                    <Col span={2}></Col>                   
                    <Col span={4}>
                    </Col>
                    <Col span={16}>
                        {
                            isLoad
                            ?
                            <Spin />
                            :
                            <UpdateItem data={data} forDetail={true}/>
                        }
                    </Col>                                                 
                    <Col span={2}></Col>
                </Row>                  
                <PCFooter/>
            </div>
        )
    }
    
}



