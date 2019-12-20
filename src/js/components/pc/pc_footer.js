import React from 'react';
import ReactDOM from 'react-dom';
import { Row,Col } from 'antd';


export default class PCFooter extends React.Component {
    
    

    render() {
        return (
            <footer>
                <Row>
                    <Col span={2}></Col>
                    <Col span={20} style={{fontSize:'12px', margin:'30px 0'}}>
                       &copy;&nbsp;2019 ReactNews. All Rights Reserved.
                       <br/>
                       owner: renshanhang
                    </Col>
                    
                    <Col span={2}></Col>
                </Row>
            </footer>

        )
    }
}
