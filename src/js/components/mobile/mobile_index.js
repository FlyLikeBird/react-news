import React from 'react';
import { Link } from 'react-router-dom';
import ScrollContainer from './mobile_scroll_container';
import AutoCarousel from '../autoCarousel';
import NewsImageBlock from '../news_image_block';
import TopicList from '../topic_list/topic_list';
import { Menu, Spin, Icon } from 'antd';

export default class MobileIndex extends React.Component {
    
    constructor(){
        super();
        this.state = {
            topicList:[],
            isLoading:true
        }
    }
    
    componentDidMount(){
        fetch(`/api/topic/getAllTopics`)
            .then(response=>response.json())
            .then(json=>{
                var { data } = json;
                var arr = data.slice(0,10);
                this.setState({topicList:arr});
            })
    }

    handleClick(link){
        var { history, onLink } = this.props;
        if (onLink) onLink(link);
        if (history) history.push(link);
    }

    render(){
        var { history } = this.props;
        var { topicList } = this.state;
        //console.log(newsList);
        return (
            <ScrollContainer> 
                {/*               
                <div style={{height:'160px'}}>
                    <AutoCarousel count={4} history={history} simple={true}/>
                </div>
             
                <div className="nav-container">
                    <div onClick={this.handleClick.bind(this,'/newsIndex')} style={{backgroundImage:`url(http://image.renshanhang.site/newsIndex.png)`,margin:'0 10px 0 20px'}}>
                        <span><Icon type="read" /><span>新闻中心</span><Icon type="read" /></span>
                    </div>
                    <div onClick={this.handleClick.bind(this,'/topicIndex')} style={{backgroundImage:`url(http://image.renshanhang.site/topicIndex.png)`, margin:'0 20px 0 10px'}}>
                        <span><Icon type="number" /><span>话题中心</span><Icon type="number" /></span>
                    </div>
                </div>
                <NewsImageBlock iconType="fire" count={10} type="yule"  cardTitle="本周热门新闻"  columns={2}/>
                <div>
                    <div className="news-title-container">
                        <span className="text"><Icon type="message"/>本周热门话题</span>
                    </div>
                    <TopicList data={topicList} forIndex={true} inline={true} columns={2} history={history}/>
                </div>
            */}
            </ScrollContainer>
            
        )
    }
}






