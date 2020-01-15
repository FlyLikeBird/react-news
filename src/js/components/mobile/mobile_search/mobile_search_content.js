import React from 'react';
import { Form, Input, Select, Icon, Spin, message } from 'antd';
import NewsBlock from '../../news_block';
import style from './mobile_search_style.css';

const arr = [{title:'赵丽颖'},{title:'美国'},{title:'中国'},{title:'拼娃之战'},{title:'个人素质'},{title:'歼20'}];

export default class SearchContent extends React.Component {
    constructor(){
        super();
        this.state = {
            newsList:[],
            topicList:[],
            isLoading:true
        }
    }

    componentDidMount(){
        var promise1 = new Promise((resolve, reject)=>{
          fetch(`/api/article/getArticleTitle?type=yule&count=10`)
          .then(response=>response.json())
          .then(json=>{
            var { data } = json;
            resolve(data);
          })
        });
        var promise2 = new Promise((resolve, reject)=>{
          fetch(`/api/topic/getTopicList?count=10`)
          .then(response=>response.json())
          .then(json=>{
            var { data } = json;
            resolve(data);
          })
        });
        Promise.all([promise1,promise2])
          .then(([newsList, topicList])=>{
            this.setState({newsList, topicList, isLoading:false});
          });
    }

    handleGotoSearch(title){
        var { onSearch } = this.props;
        if ( onSearch) onSearch(title);
    }

    handleRemoveHistory(){
        var { onUpdateSearchHistory } = this.props;
        if (onUpdateSearchHistory) onUpdateSearchHistory(null, true);
    }

    
    render() {
        var { searchHistory } = this.props;
        var { newsList, topicList, isLoading } = this.state;
        return (
            <div style={{textAlign:'center'}}>
                {
                    isLoading
                    ?
                    <Spin/>
                    :
                    <div style={{textAlign:'left'}}>
                        <div className={style["tags"]}>
                            <span className={style.text}>热门搜索</span>
                            <ul>
                              {
                                arr.map((item,index)=>(
                                  <li key={index} onClick={this.handleGotoSearch.bind(this,item.title)}><span>{item.title}</span></li>
                                ))
                              }
                            </ul>
                        </div>
                        <div className={style["tags"]}>
                            <span className={style.text}>搜索历史</span>
                            <span className={`${style["button"]} ${style["text"]}`} onClick={this.handleRemoveHistory.bind(this)}>删除历史</span>
                            <ul>
                              { 
                                searchHistory && searchHistory.length
                                ?
                                searchHistory.map((item,index)=>(
                                  <li key={index} onClick={this.handleGotoSearch.bind(this,item.title)}><span>{item.title}</span></li>
                                ))
                                :
                                '暂无搜索历史!'
                                
                              }
                            </ul>
                        </div>
                        <NewsBlock title="本周热门新闻" data={newsList} hasTitle={true}/>
                        <NewsBlock title="本周热门话题" data={topicList} hasTitle={true} forTopic={true} />
                    </div>
                }
            </div>    
            
        )
    }

}










