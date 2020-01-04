import React from 'react';

import { Menu, Button, Icon, Tabs, Row, Col, Card, List, Spin, Badge } from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const TabPane = Tabs.TabPane;

const { Meta } = Card;

import MessageContainer from '../../message_container/message_container';
import CollectContainer from '../../collectComponent';
import PCUsercenterTopic from './pc_usercenter_topic'; 
import MyCommentsList from './pc_usercenter_mycommentslist';
import UpdateContainer from '../../update_list/update_list';
import FollowContainer from './pc_usercenter_follow';
import HistoryContainer from './pc_usercenter_history';

export default class PCUserCenterContainer extends React.Component{

    constructor(){
        super();
        this.state = {
            loadChart:false,
            UserChart:()=>{}
        }
    }


    loadChartSource(){
        var { loadChart } = this.state;
        if (!loadChart){
            import('./pc_usercenter_chart').then(UserChart=>{
                this.setState({UserChart:UserChart.default,loadChart:true})
            })
        }
    }

    render(){
        var { loadChart, UserChart } = this.state;
        var { user, userFollows, userFans, userHistorys, socket, history, match, isSelf, msg, onCheckLogin } = this.props;
        
        return(

                <div>
                    <Tabs className="usercenter-tabs" style={{paddingLeft:'10px'}} defaultActiveKey="action" tabPosition="left">
                            <TabPane tab={<span><Icon type="share-alt" />{isSelf?"我的动态":"TA的动态"}</span>} key="action" className="background-color">
                                <UpdateContainer user={user._id} history={history} socket={socket} isSelf={isSelf} onCheckLogin={onCheckLogin}/>
                            </TabPane>
                            <TabPane tab={<span><Icon type="container" />{isSelf?"我的关注":"TA的关注"}</span>} key="follow"> 
                                <FollowContainer isSelf={isSelf} socket={socket} history={history} match={match} data={userFollows} text="follow"/>
                            </TabPane>
                            <TabPane tab={<span><Icon type="usergroup-add" />{isSelf?"我的粉丝":"TA的粉丝"}</span>} key="fans">
                                <FollowContainer isSelf={isSelf} socket={socket} history={history} match={match} data={userFans} text="fans"/>
                            </TabPane>                            
                            {
                                isSelf
                                ?
                                <TabPane tab={<Badge className="message-info" count={msg.total}><span><Icon type="notification" />我的消息</span></Badge>} key="message">
                                    <MessageContainer history={history} socket={socket} msg={msg}/>
                                </TabPane>
                                :
                                null
                            }                            
                            <TabPane tab={<span><Icon type="book" />{isSelf?"我的收藏":"TA的收藏"}</span>} key="collect">
                                <CollectContainer history={history} isSelf={isSelf} match={match} forUser={true} user={user._id}/>
                            </TabPane>
                            
                            <TabPane tab={<span><Icon type="message" />{isSelf?"我的话题":"TA的话题"}</span>} key="topic">
                                <PCUsercenterTopic history={history} user={user._id} isSelf={isSelf}/> 
                            </TabPane>
                            {
                                isSelf 
                                ?
                                <TabPane className="background-color" tab={<span><Icon type="file-search" />我的评论</span>} key="comment">
                                    <MyCommentsList socket={socket} history={history} onCheckLogin={onCheckLogin} />
                                </TabPane>
                                :
                                null
                            }
                            
                            {
                                isSelf
                                ?
                                <TabPane className="background-color" tab={<span><Icon type="history" />浏览记录</span>} key="history">
                                    <HistoryContainer text="暂时没有浏览任何文章" data={userHistorys} history={history} hastime={true} hasImg={true} forUser={true} />                               
                                </TabPane>
                                :
                                null
                            }
                            
                            <TabPane tab={<span><Icon type="solution" />个人信息</span>} key="info">
                                暂无个人信息
                            </TabPane>
                    
                    </Tabs>
                    {/*
                    <div className="chart-container">
                        <Button type="primary"  shape="circle" onClick={this.loadChartSource.bind(this)}><Icon type="bar-chart" /></Button>                       
                    </div>
                */}
                    { loadChart && <UserChart visible={true} />}
                </div>    

        )
    }
}


