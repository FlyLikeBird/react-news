import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Icon, Badge } from 'antd';
import style from './mobile_footer_style.css';

class MobileFooter extends React.Component {
    constructor(){
        super();
        this.state = {
            data:[
                {link:'/', icon:'eye', text:'首页'},
                {link:'/newsIndex', icon:'container', text:'新闻'},
                {link:'/topicIndex', icon:'message', text:'话题'},
                {link:'/message', icon:'bell', text:'消息'},
                {link:'/usercenter', icon:'user', text:'我的'}
            ]
        }
    }

    gotoLink(link){
        var { history, onLink, onCheckLogin } = this.props;
        if (history){
            if (link=='/message' ){
                if (onCheckLogin()){
                    history.push(link);
                }
            } else if (link=='/usercenter') {
               var userid = onCheckLogin();
               if(userid){
                    history.push(`${link}/${userid}`);
               }
            } else {
                if (onLink) onLink(link);
                history.push(link);
            }
        }
        
    }

    render(){
        var { current, msg } = this.props;
        var { data } = this.state;
        return (
                   
                <div className={style['container']}>                                       
                    {
                        data.map((item,index)=>(
                            <div
                                key={index}
                                onClick={this.gotoLink.bind(this,item.link)}
                                className={current==item.link ? `${style['item']} ${style['selected']}` : style['item']}
                            >
                                {
                                    item.link == '/message' 
                                    ?
                                    <Badge count={msg.total}><Icon type={item.icon} theme={current==item.link?'filled':'outlined'}/></Badge>
                                    :
                                    <Icon type={item.icon} theme={current==item.link?'filled':'outlined'}/>
                                }
                                <br/>
                                {item.text}
                            </div>
                        ))
                    }
                </div>
            
        )
    }
}

export default MobileFooter = withRouter(MobileFooter);





