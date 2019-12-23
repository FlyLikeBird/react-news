import React from 'react';
import NewsList from '../../news_list/news_list';
import AutoCarousel from '../../autoCarousel';
import MobileFooter from '../mobile_footer';
import { Menu, Spin, Tabs, Carousel } from 'antd';
const { TabPane } = Tabs;
export default class MobileNewsIndex extends React.Component {
    
    constructor(){
        super();
        this.state = {
            tag:'shehui',
            newsList:[],
            isLoading:true
        }

    }

    _loadNewsList(){
        var { tag } = this.state;
        fetch(`/api/article/getArticleList?type=${tag}&count=20`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                this.setState({newsList:data,isLoading:false});       
            })
    }

    componentDidMount(){
        this._loadNewsList();
    }

    handleChange(activeKey){
        this.setState({isLoading:true, tag:activeKey});
        this.setState(()=>{
            this._loadNewsList();
        })
    }

    render(){
        
        var { isLoading, newsList } = this.state;
        return (
            <div> 
                <Carousel autoplay>
                    {
                        isLoading
                        ?
                        <Spin/>
                        :
                        newsList.map((item,index)=>(
                            <div key={index} style={{backgroundImage:`url(${item.thumbnails[0]})`}}></div>
                        ))
                    }
                </Carousel>
                
                <Tabs defaultActiveKey="shehui" onChange={this.handleChange.bind(this)}>
                    { isLoading ? <Spin/> : <TabPane tab="社会" key="shehui"><NewsList data={newsList} hasImg={true}/></TabPane> }
                    { isLoading ? <Spin/> : <TabPane tab="国内" key="guonei"><NewsList data={newsList} hasImg={true}/></TabPane> }
                    { isLoading ? <Spin/> : <TabPane tab="国际" key="guoji"><NewsList data={newsList} hasImg={true}/></TabPane> }
                    { isLoading ? <Spin/> : <TabPane tab="娱乐" key="yule"><NewsList data={newsList} hasImg={true}/></TabPane> }
                    { isLoading ? <Spin/> : <TabPane tab="科技" key="keji"><NewsList data={newsList} hasImg={true}/></TabPane> }
                </Tabs>
                <MobileFooter current="news"/>
            </div>            
                      
                   
        )
    }
}






