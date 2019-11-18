import React from 'react';
import {  List, Avatar, Button, Icon, Card } from 'antd';
import { Link } from 'react-router-dom';

import DeleteModal from '../deleteModal';
import NewsListItem from './news_list_item';

export default class NewsList extends React.Component{
  constructor(){
    super();
    this.state={
      list:[]
    }
  }
 
  componentDidMount(){
      var { data } = this.props;
      this.setState({list:data});
  }

  componentWillReceiveProps(newProps){
    //  搜索页面的新闻列表当页码变化时强制更新
    var { forSearch, data } = this.props;
    if ( forSearch ) {
        this.setState({list:newProps.data});
        return ;
    } 
    if ( data.length != newProps.data.length) {
        this.setState({list:newProps.data})
    }
  }
  
  handleCleanHistory(){
      fetch(`/api/usr/cleanHistory?userid=${localStorage.getItem('userid')}`)
        .then(response=>response.json())
        .then(json=>{
          this.setState({list:[]})
        })
  }

  handleDelete(deleteArticle){
    var { list } = this.state;
    var data = [...list];
    var deleteIndex = 0;
    for(var i=0,len=list.length;i<len;i++){
        if(list[i].articleId === deleteArticle){
            deleteIndex = i;
            break;
        }
    }
    data.splice(deleteIndex,1);
    this.setState({list:data})
  }

  render(){
    var { hasImg, hastime, hasSearchContent, location, history, text, forSimple, forUser, forSearch } = this.props;
    var { list, visible } = this.state;

    var newsListStyle= forSimple 
                    ?
                    { borderRadius:'4px'}
                    :
                    { borderRadius:'4px',padding:'10px 20px',backgroundColor:'#f7f7f7'}

    return(    
      
      <div style={{textAlign:'left'}}>
          {
              list.length
              ?
              <div>
                {
                    forUser
                    ?
                    <Button type="primary" style={{fontSize:'12px',marginBottom:'20px'}} onClick={this.handleCleanHistory.bind(this)}>全部删除</Button>
                    :
                    null
                    
                } 
                <div style={newsListStyle}>          
                    {
                        
                        list.map((item,index)=>(
                            <NewsListItem 
                                item={item} 
                                key={index}
                                forSimple={forSimple}
                                forSearch={forSearch}
                                history={history}
                                hastime={hastime}
                                hasImg={hasImg}
                                location={location}
                                hasSearchContent={hasSearchContent} 
                                onDelete={this.handleDelete.bind(this)}
                            />
                        ))
                        
                    }
                </div>
                
              </div>
              :
              <div style={{margin:'20px 0'}}>{text}</div> 
          }
      </div>    
      
      
    )
  }
}


