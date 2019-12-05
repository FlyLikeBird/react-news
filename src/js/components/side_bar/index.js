import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, BackTop, Button, Icon, Popover, Modal, Spin } from 'antd';

import PCNewsImageBlock from '../news_image_block';
import topic from '../../../images/topicIndex.png';
import news from '../../../images/newsIndex.png';

import style from './style.css';

export default class SideBar extends React.Component {
    
    render(){
        return(
            
                <div className={style["side-bar"]}>
                    <div className={style.modal}>
                        <Link to={`/topNews`}>
                            <div className={style.bg} style={{backgroundImage:`url(${news})`}}>
                                <Icon type="read" /><span>新闻中心</span><Icon type="read" />
                            </div>
                        </Link>
                    </div>                    
                    <div className={style.modal}>
                        <Link to={`/topicIndex`}>
                            <div className={style.bg} style={{backgroundImage:`url(${topic})`}}>
                                <Icon type="number" /><span>话题中心</span><Icon type="number" />
                            </div>
                        </Link>
                    </div>
                    <PCNewsImageBlock count={40} type="shehui" size="small" cardTitle="相关推荐" columns={2}/>
                </div>
                
        )
    }
}
