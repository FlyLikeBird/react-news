import React from 'react';

import { Menu, Button, Icon, Tabs, Row, Col, Card, List, Spin, Badge } from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const TabPane = Tabs.TabPane;

const { Meta } = Card;

import UserList from '../pc_search/pc_user_list';
import NewsList from './pc_newslist';
import MessageContainer from './pc_usercenter_message';
import CollectContainer from '../../collectComponent';
import UpdateContainer from './pc_usercenter_update';
import FollowContainer from './pc_usercenter_follow';

export default class PCUserCenterContainer extends React.Component{

    constructor(){
        super();
        this.state = {
            loadChart:false,
            loadUserComment:false,
            loadUserTopic:false,
            UserComment:()=>null,
            UserTopic:()=>{},
            UserChart:()=>{}
        }
    }

    handleChangeTabs(activeKey){
        if (activeKey==='topic'){
            import('./pc_usercenter_topic').then(UserTopic=>{
                this.setState({UserTopic:UserTopic.default,loadUserTopic:true})
            })
        } else if (activeKey ==='comment'){
            import('./pc_usercenter_mycommentslist').then(UserComment=>{
                this.setState({UserComment:UserComment.default,loadUserComment:true})
            })
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
        var { loadChart, loadUserComment, loadUserTopic, UserComment, UserTopic, UserChart } = this.state;
        var { userFollow, userFans, userAction, userComments, userHistory, userCollect, followedCollect, socket, history, match, isSelf, msg } = this.props;
        
        return(

                <div>
                    <Tabs onChange={this.handleChangeTabs.bind(this)} className="usercenter-tabs" style={{paddingLeft:'10px'}} defaultActiveKey="action" tabPosition="left">
                            <TabPane tab={isSelf?"我的动态":"TA的动态"} key="action" className="background-color">
                                <UpdateContainer data={userAction} history={history} socket={socket} isSelf={isSelf}/>
                            </TabPane>
                            <TabPane tab={isSelf?"我的关注":"TA的关注"} key="follow"> 
                                <FollowContainer isSelf={isSelf} socket={socket} history={history} match={match} data={userFollow} text="follow"/>
                            </TabPane>
                            <TabPane tab={isSelf?"我的粉丝":"TA的粉丝"} key="fans">
                                <FollowContainer isSelf={isSelf} socket={socket} history={history} match={match} data={userFans} text="fans"/>
                            </TabPane>                            
                            {
                                isSelf
                                ?
                                <TabPane tab={<Badge count={msg.total}><span>我的消息</span></Badge>} key="message">
                                    <MessageContainer socket={socket} msg={msg}/>
                                </TabPane>
                                :
                                null
                            }                            
                            <TabPane tab={isSelf?"我的收藏":"TA的收藏"} key="collect">
                                <CollectContainer isSelf={isSelf} data={userCollect} match={match} forUser={true}/>
                            </TabPane>
                            
                            <TabPane tab={isSelf?"我的话题":"TA的话题"} key="topic">
                                { loadUserTopic && <UserTopic history={history}/> }
                            </TabPane>
                            {
                                isSelf 
                                ?
                                <TabPane className="background-color" tab="我的评论" key="comment">
                                    <UserComment data={userComments} history={history} text="还没有发布过任何评论!" />
                                </TabPane>
                                :
                                null
                            }
                            
                            {
                                isSelf
                                ?
                                <TabPane className="background-color" tab="浏览记录" key="history">

                                    <NewsList text="没有任何浏览记录" data={userHistory} history={history} hastime={true} hasImg={true} forUser={true} />
                                
                                </TabPane>
                                :
                                null
                            }
                            
                            <TabPane tab="个人信息" key="info">

                                
                            </TabPane>
                    
                    </Tabs>
                    <div className="chart-container">
                        <Button type="primary"  shape="circle" onClick={this.loadChartSource.bind(this)}><Icon type="bar-chart" /></Button>                       
                    </div>
                    { loadChart && <UserChart visible={true} />}
                </div>    

        )
    }
}


