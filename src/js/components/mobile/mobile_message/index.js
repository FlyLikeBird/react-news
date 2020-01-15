import React from 'react';
import ScrollContainer from '../mobile_scroll_container';
import MessageContainer from '../../message_container/message_container';
import { Menu, Spin, Tabs } from 'antd';
const { TabPane } = Tabs;
export default class MobileMessage extends React.Component {
    
    render(){
        var { history, socket, user, onCheckLogin, msg } = this.props;
        console.log(msg);
        return (
            <ScrollContainer>
                {
                    msg && msg.userMsg
                    ?
                    <MessageContainer history={history} socket={socket} msg={msg}/>
                    :
                    null
                }
            </ScrollContainer>            
                      
                   
        )
    }
}






