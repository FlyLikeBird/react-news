import React from 'react';
import { Row, Col, BackTop, Button, Icon, Popover, Modal, Spin } from 'antd';

import PCNewsImageBlock from '../news_image_block';
import topic from '../../../images/topicIndex.png';
import news from '../../../images/newsIndex.png';

export default class SideBar extends React.Component {
    
    render(){
        var newsBgStyle = {
            backgroundRepeat: 'no-repeat',
            backgroundPosition:'center',
            backgroundSize:'cover',
            borderRadius:'4px',
            backgroundImage:`url(${news})`,
            height:'100px'
        };
        var topicBgStyle = {
            backgroundRepeat: 'no-repeat',
            backgroundPosition:'center',
            backgroundSize:'cover',
            borderRadius:'4px',
            backgroundImage:`url(${topic})`,
            height:'100px'
        };
        return(
            
                <div>
                    <div style={newsBgStyle}></div>                    
                    <div style={topicBgStyle}></div>
                    <PCNewsImageBlock count={40} type="shehui" size="small" cardTitle="相关推荐" columns={2}/>
                </div>
                
        )
    }
}
