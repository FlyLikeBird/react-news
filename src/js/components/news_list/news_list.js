import React from 'react';
import {  List, Avatar, Button, Icon, Card } from 'antd';
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
    var { forSearch, forMobile, data } = this.props;
    if ( forSearch || forMobile ) {
        this.setState({list:newProps.data});
        return ;
    } 
    if ( data.length != newProps.data.length) {
        this.setState({list:newProps.data})
    }
  }
  

  render(){
    var { hasImg, hastime, hasSearchContent, location, history, text, forMobile, params, forSimple, forUser, forSearch } = this.props;
    var { list, visible } = this.state;
    return(    
      
      <div style={{textAlign:'left'}}>
          {
              list.length
              ?             
              <div>          
                  {
                      
                      list.map((item,index)=>(
                          <NewsListItem 
                              data={item} 
                              key={index}
                              forSimple={forSimple}
                              forSearch={forSearch}
                              history={history}
                              hastime={hastime}
                              hasImg={hasImg}
                              forMobile={forMobile}
                              params={params}
                              location={location}
                              hasSearchContent={hasSearchContent} 
                          />
                      ))
                      
                  }
              </div>             
              :
              <div style={{margin:'20px 0'}}>{text}</div> 
          }
      </div>    
      
      
    )
  }
}


