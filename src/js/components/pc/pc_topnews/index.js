import React from 'react';
import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin , Button } from 'antd';

import TopNewsItem from './topnews_item';
import style from '../../news_block/style.css';

var arr = ['guonei','yule','guoji','shehui'];
var count = 0;
export default class PCTopNewsIndex extends React.Component{
    constructor(){
        super();
        this.state={
           position:0,
           currentIndex:0,
           data:[],
           isLoading:true,
           allowUpdate:false,
           scrollToBottom:false
                     
        }
    }

    _fetchData(type){
        return new Promise((resolve, reject)=>{
            fetch(`/api/article/getArticleTitle?type=${type}&count=20`)
                .then(response=>response.json())
                .then(json=>{
                    var { data } = json;
                    resolve(data);
                })
        })      
    }

    componentDidMount(){
        var { onLoadScrollFunc } = this.props;
        var container = this.topNewsContainer;
        var promises = arr.map(item=>this._fetchData(item));
        Promise.all(promises)
            .then(newsList=>{
                var data = newsList.concat(newsList);
                this.setState({data, isLoading:false});
                if ( onLoadScrollFunc) onLoadScrollFunc();
            })   
    }

    componentWillReceiveProps(newProps){
        var { reload } = newProps;
        console.log(reload);            
        if (reload) {
            console.log(count);
            count++;
            if ( count>3 ) {
                this.setState({scrollToBottom:true});
            } else {
                this._reloadNewsList();
            }     
        }           
    }

    _reloadNewsList(){
        var { data } = this.state;
        data = data.map(item=>{
            var arr = item.concat(item);
            return arr;
        })
        this.setState({data})
    }

    handleToggle(direction){
        var { currentIndex, data } = this.state;
        var position = 0;
        var prevIndex;
        if (direction ==='left'){
            prevIndex = currentIndex;
            currentIndex++;
            position = -25;
            if (currentIndex>(data.length-4)){
                setTimeout(()=>{                   
                    this.setState({currentIndex:prevIndex, position:25});
                },100)
            } 
            this.setState({currentIndex, position, allowUpdate:true})
        } else {
            prevIndex = currentIndex;
            currentIndex--;
            //  当列表已经在最左端而向右滑动时，往左拉回25距离
            position = 25;
            if (currentIndex<0){
                setTimeout(()=>{                               
                    this.setState({currentIndex:prevIndex, position:-25});
                },100)
            } 
            this.setState({currentIndex, position, allowUpdate:true})                 
        }
        // 将allowUpdate 重置为false,防止自动加载时 <topNews-item /> 更新
        setTimeout(()=>{
            this.setState({allowUpdate:false});
        },300)
        
    }

    
    render(){
        var { fixPosition } = this.props;
        var { isLoading, data, position, currentIndex, allowUpdate, scrollToBottom } = this.state;
        
        return(

             
            <div style={{paddingTop:'30px',height:'100%'}}>
                <Col span={2}></Col>                   
                <Col span={20} style={{height:'100%'}}>
                    {
                        isLoading
                        ?
                        <Spin size="large"/>
                        :
                        <div className={style["topNews-container"]}>
                            {
                                data.map((item,index)=>(
                                    <TopNewsItem 
                                        key={index} 
                                        data={item} 
                                        initPosition={index*25} 
                                        movePosition={position}
                                        allowUpdate={allowUpdate} 
                                        selected={ index >= currentIndex && index<(currentIndex+4) ? true: false} 
                                        fixPosition={fixPosition}
                                    />
                                ))
                            }
                            {
                                scrollToBottom
                                ?
                                <span>没有更多新闻了！</span>
                                :
                                null
                            }
                            <Button onClick={this.handleToggle.bind(this,'left')} className="toggle toggle-left"><Icon type="left" /></Button>
                            <Button onClick={this.handleToggle.bind(this,'right')} className="toggle toggle-right"><Icon type="right" /></Button>
                        </div>
                    }
                    
                   
                </Col>                   
                <Col span={2}></Col>
            </div>
                    
                
            

        )
    }
}


