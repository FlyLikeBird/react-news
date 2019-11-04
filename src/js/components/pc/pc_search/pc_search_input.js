import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Tabs, message, Form, Input, Button, CheckBox, Modal, Popover, Card } from 'antd';

import SearchComponent from './search_component';

const Search = Input.Search;

const arr = [{title:'赵丽颖'},{title:'美国'},{title:'中国'},{title:'拼娃之战'},{title:'个人素质'},{title:'歼20'}];

export default class SearchInput extends React.Component {
    
    constructor(props) {
      super();
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
      var { visible, iconType } = this.state;
      if (this.state.iconType == 'search'){
        this.setState({iconType:'close',visible:!visible});
      } else {
        this.setState({iconType:'search',visible:!visible});
      }
      setTimeout(()=>{
        var span = document.getElementsByClassName('search-input')[0];
        var input = span.getElementsByClassName('ant-input')[0];
        //console.log(span);
        if (input && input.focus) input.focus();
        console.log(span);
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

    handleRemoveHistory(){
      localStorage.removeItem('searchHistory');
      this.setState({searchList:[]});
    }

    handleGotoSearch(title){
      var { history } = this.props;       
      history.push(`/search?words=${title}`);
      //this.handleClick()
    }

    handleBlur(){
      this._handleCloseSearchInput();
    }

    _handleCloseSearchInput(){
      this.setState({visible:false})
    }

    handleVisibleChange(visible){
      if (visible == true){
          this.setState({iconType:'close'});
          setTimeout(()=>{
              var span = document.getElementsByClassName('search-input')[0];
              var input = span.getElementsByClassName('ant-input')[0];
              
              if (input && input.focus) input.focus();
              span.classList.add('click');
          },0);
      } else {
          this.setState({iconType:'search'});
          setTimeout(()=>{
              var span = document.getElementsByClassName('search-input')[0];
              span.classList.remove('click');
          },0);
      }
    }

    render() {
        var { iconType, visible, searchList } = this.state;
        

        return (
            <Popover 
              //trigger="click" 
              
              autoAdjustOverflow={false}
              placement="bottom"
              //onClick={this.handleClick.bind(this)}
              //onBlur={this.handleBlur.bind(this)}
              onVisibleChange={this.handleVisibleChange.bind(this)}
              content={
                <div className="search-container">
                    <SearchComponent onModalVisible={this.handleModalVisible.bind(this)} {...this.props}/>
                    <div>
                      <div className="tags">
                          <span>热门搜索</span>
                          <ul>
                            {
                              arr.map((item,index)=>(
                                <li key={index} onClick={this.handleGotoSearch.bind(this,item.title)}><a>{item.title}</a></li>
                              ))
                            }
                          </ul>
                      </div>
                      <div className="tags">
                          <span>搜索历史</span>
                          <span className="button" onClick={this.handleRemoveHistory.bind(this)}>删除历史</span>
                          <ul>
                            { 
                              searchList && searchList.length
                              ?
                              searchList.map((item,index)=>(
                                <li key={index} onClick={this.handleGotoSearch.bind(this,item.title)}><a>{item.title}</a></li>
                              ))
                              :
                              '暂无搜索历史!'
                              
                            }
                          </ul>
                      </div>
                    </div>
                </div>
            }>
                <Button type="primary" size="small" shape="circle" icon={iconType} />
            </Popover>
        )
    }

    
}










