import React from 'react';

import { Link, Switch } from 'react-router-dom';
import { Icon } from 'antd';
import style from './mobile_footer_style.css';

export default class MobileFooter extends React.Component {
    
    
    render(){
        var { current } = this.props;
        return (
                   
                <div className={style['container']}>                    
                    <Link to="/">
                        <div className={current=='/'?`${style['selected']} ${style['item']}`:style['item']}><Icon type="eye"/><br/>首页</div>
                    </Link>
                    <Link to="/news">
                        <div className={current=='news'?`${style['selected']} ${style['item']}`:style['item']}><Icon type="eye"/><br/>新闻</div>
                    </Link>
                    <Link to="/topicIndex">
                        <div className={current=='topic'?`${style['selected']} ${style['item']}`:style['item']}><Icon type="eye"/><br/>话题</div>
                    </Link>
                    <Link to="/">
                        <div className={current=='message'?`${style['selected']} ${style['item']}`:style['item']}><Icon type="eye"/><br/>消息</div>
                    </Link>
                    <Link to="/">
                        <div className={current=='usercenter'?`${style['selected']} ${style['item']}`:style['item']}><Icon type="eye"/><br/>我的</div>
                    </Link>
                    
                </div>
            
        )
    }
}






