import React from 'react';
import { Menu, Spin, Tabs, Input, Button, Icon, Modal } from 'antd';
import MobileInput from './mobile_input';
import ArticleComment from './mobile_article_comment';
import ShareModal from '../../shareModal';
import style from './mobile_comment_style.css';
export default class MobileDetailComment extends React.Component {
    
    constructor(){
        super();
        this.state = {
            shareVisible:false,
            item:{}
        }
    }

    handleShareVisible(boolean){
        this.setState({shareVisible:boolean});
    }

    render(){
        var { shareVisible } = this.state;
        var { uniquekey, user, item, type, onCheckLogin } = this.props;
       
        return (
            <div className={style['comment-container']}>
                <MobileInput />                
                {
                    type == 'Article'
                    ?
                    <ArticleComment onCheckLogin={onCheckLogin} user={user} uniquekey={uniquekey} onVisible={this.handleShareVisible.bind(this)}/>
                    :
                    null
                } 
                {
                    shareVisible
                    ?
                    <ShareModal 
                        visible={shareVisible}
                        onModel="Article"
                        uniquekey={uniquekey}      
                        onVisible={this.handleShareVisible.bind(this)} 
                        item={item}
                    />
                    :
                    null
                }                          
            </div>   
                   
        )
    }
}






