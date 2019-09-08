import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Tabs, message, Form, Input, Button, CheckBox, Modal, Popover, Card } from 'antd';

import SearchComponent from './search_component';

const Search = Input.Search;

export default class SearchInput extends React.Component {
    
    constructor(props) {
      super();
      //console.log(props);
      this.state = {
        visible:false,
        iconType:'search',
        searchList:[]
      }
    }

    componentWillMount(){
       const searchList = JSON.parse(localStorage.getItem('searchHistory'));
       this.setState({searchList});
    }

    handleClick(){
      //console.log('hello');
      //console.log('click');
      //console.log(this);
      this.setState({visible:!this.state.visible});
      if (this.state.iconType == 'search'){
        this.setState({iconType:'close'});
      } else {
        this.setState({iconType:'search'});
      }
      setTimeout(()=>{
        var span = document.getElementsByClassName('search-container')[0];
        var input = span.getElementsByClassName('ant-input')[0];
        //console.log(span);
        if (input) input.focus();
        
        if(!span.classList.contains('click')){
          span.classList.add('click');
        } else {
          span.classList.remove('click');
        }
        
      },0);

      
      
    }
    
    handleModalVisible(){
      this.handleClick();
    }

    handleRemoveClick(){
      localStorage.removeItem('searchHistory');
      this.setState({searchList:[]});
    }

    handleGotoSearch(title){
      var { history } = this.props;  
      
      history.push(`/search?words=${title}&type=news`);
      this.handleClick()
    }

    render() {

        const arr = [{title:'赵丽颖'},{title:'美国'},{title:'中国'},{title:'拼娃之战'},{title:'个人素质'},{title:'歼20'}];

        return (
            <Popover 
              className="search-popover"
              trigger="click" 
              visible={this.state.visible}
             
              onClick={this.handleClick.bind(this)}
              content={<div>
                <SearchComponent onModalVisible={this.handleModalVisible.bind(this)} {...this.props}/>
                <div style={{width:'420px',paddingTop:'10px'}}>
                  <Card bordered={false} className="tags" size="small" title="热门搜索">
                    <ul>
                      {
                        arr.map((item,index)=>(
                          <li key={index} onClick={this.handleGotoSearch.bind(this,item.title)}><a>{item.title}</a></li>
                        ))
                      }
                    </ul>
                  </Card>
                  <Card bordered={false} className="tags" size="small" title="搜索历史" extra={<a onClick={this.handleRemoveClick.bind(this)}>删除历史</a>}>
                    <ul>
                      { 
                        this.state.searchList 
                        ?
                        (this.state.searchList.length ?
                        this.state.searchList.map((item,index)=>(
                          <li key={index} onClick={this.handleGotoSearch.bind(this,item.title)}><a>{item.title}</a></li>
                        ))
                        :
                        '暂无搜索历史!')
                        :
                        '暂无搜索历史!'
                      }
                    </ul>
                  </Card>
                </div>
              </div>}>
                <Button type="primary" size="small" shape="circle" icon={this.state.iconType} />
            </Popover>
        )
    }

    
}










