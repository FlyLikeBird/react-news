import React from 'react';

import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin, Badge, Popover } from 'antd';

import TopicListContainer from './pc_topic_list_container';
import TopicList from '../../topic_list/topic_list';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


const TabPane = Tabs.TabPane;

const { Meta } = Card;


export default class TopicContainer extends React.Component{
    constructor(){
        super();
        this.state={
            
        }
    }

    
    render(){

        const content = <div>
                            <h3>什么是话题？</h3>
                            <p>话题是由用户发起的就某一主题展开讨论/交流时事热点/分享个人心得的公共空间。</p>
                            <h3>发起话题有什么好处？</h3>
                            <p>作为发起人，你的头像会一直展示在话题页，可能获得更多用户的关注和粉丝数。</p>
                            <h3>如何创建高质量的话题？</h3>
                                <div>
                                    <h4>(1).为避免话题被重复创建，请先查看是否已存在相似话题</h4>
                                    <p>在话题名称输入框内输入关键词即可得出相关话题结果。如话题已经存在，可直接在该话题下参与讨论。</p>
                                </div>
                                <div>
                                    <h4>(2).话题需要一个明确/具体/集中的讨论点</h4>
                                    <p>错误示范：“我最喜欢的作家”“我最喜欢的一部电影”</p>
                                    <p>正确示范：“跟着电影去旅行”“我的港乐情怀”</p>
                                    
                                </div>
                                <div>
                                    <h4>(3).避免发起仅解决个人问题的求助类话题</h4>
                                    <p>错误示范:“22岁的我因为学业问题与父母产生分歧，我该怎么办？”</p>
                                    <p>正确示范:"你是如何与父母沟通的？"</p>
                                </div>
                                <div>
                                    <h4>(4).避免“一句话总结／概括／说明....“这类不利于引发深刻讨论的句型</h4>
                                    <p>错误示范:“一句话证明你看过《红楼梦》“</p>
                                    <p>正确示范:"红楼梦有哪些令你印象深刻的章节"</p>
                                </div>

                        </div>
        return(

            <div>
                <div>
                    <h2 style={{display:'inline-block',marginRight:'6px'}}>话题中心</h2>
                    <Popover  content={content}>
                        <Icon type="question-circle"/>
                    </Popover>
                </div>
                <TopicListContainer {...this.props}/>
                
            </div>
                       
        )
    }
}


