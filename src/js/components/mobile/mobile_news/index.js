import React from 'react';
import NewsList from '../../news_list/news_list';
import AutoCarousel from '../../autoCarousel';
import ScrollContainer from '../mobile_scroll_container';
import { Menu, Spin, Tabs } from 'antd';
const { TabPane } = Tabs;
export default class MobileNewsIndex extends React.Component {
    
    constructor(){
        super();
        this.state = {
            tag:'shehui',
            newsList:[],
            addNews:[],
            isLoading:true,
            autoLoad:false,
            canScroll:true
        }

    }

    _loadNewsList(tag){
        fetch(`/api/article/getArticleList?type=${tag}&count=20`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                this.setState({newsList:data,addNews:data,isLoading:false});       
            })
    }

    componentDidMount(){
        this._loadNewsList(this.state.tag);
    }

    handleChange(activeKey){
        this.setState({tag:activeKey});
        this.setState((state)=>{
            this._loadNewsList(state.tag);
        })
    }

    _scrollToBottom(){
        var { newsList, addNews } = this.state;
        this.setState({autoLoad:true, canScroll:false});
        setTimeout(()=>{
            var arr = newsList.concat(addNews);
            this.setState({newsList:arr,autoLoad:false});
        },500);
        setTimeout(()=>{
            this.setState({canScroll:true});
        },2000)
    }


    render(){
        var { history } = this.props;
        var { isLoading, newsList, autoLoad, canScroll } = this.state;
        return (
            
                <ScrollContainer onScrollToBottom={this._scrollToBottom.bind(this)} autoLoad={autoLoad} canScroll={canScroll}>
                    <div style={{height:'160px'}}>
                        <AutoCarousel count={4} history={history} simple={true}/>
                    </div>
                    
                    {
                        isLoading
                        ?
                        <Spin/>
                        :
                        <Tabs defaultActiveKey="shehui" onChange={this.handleChange.bind(this)}>
                            <TabPane tab="社会" key="shehui"><NewsList data={newsList} hasImg={true} forMobile={true} history={history}/></TabPane> 
                            <TabPane tab="国内" key="guonei"><NewsList data={newsList} hasImg={true} forMobile={true} history={history}/></TabPane> 
                            <TabPane tab="国际" key="guoji"><NewsList data={newsList} hasImg={true} forMobile={true} history={history}/></TabPane> 
                            <TabPane tab="娱乐" key="yule"><NewsList data={newsList} hasImg={true} forMobile={true} history={history}/></TabPane> 
                            <TabPane tab="科技" key="keji"><NewsList data={newsList} hasImg={true} forMobile={true} history={history}/></TabPane> 
                        </Tabs>
                    }
                </ScrollContainer>
                
        )
    }
}






