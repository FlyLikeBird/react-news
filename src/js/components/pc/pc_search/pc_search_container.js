import React from 'react';

import { Row, Col, Input, Select, DatePicker, Pagination, Spin, Tabs } from 'antd';

import NewsList from '../../news_list/news_list';
import TopicList from '../../topic_list/topic_list';
import UserList from '../../user_list/user_list';
import SearchComponent from '../../search_container/search_component';
import { parseDate, formatDate, translateType } from '../../../../utils/translateDate';

const { TabPane } = Tabs;
const { Option, OptGroup } = Select;
const Search = Input.Search;
const { RangePicker } = DatePicker;

export default class PCSearchContainer extends React.Component{
  constructor(){
    super();
    this.state={
      newsList:[],
      topicList:[],
      userList:[],
      count:0,
      value:'time',
      order:'time',
      count:0,
      type:'Article',
      startDate:'',
      endDate:'',
      isLoading:true
    }
  }

  handleDateChange(date,datestring){
    this.setState({startDate:datestring[0],endDate:datestring[1]});
    this._loadSearchList(1,this.state.order,null,datestring[0],datestring[1]);
  }

  componentDidMount(){
    this._loadSearchList();
  }

  _loadSearchList(pageNum=1,state,params,start,end){  
    var search = params ? params:this.props.location.search;
    var type = 'Article',order = 'time';
    if (state){
        type = state.type;
        order = state.order;
    }
    if (type=='Article'){
        fetch(`/api/article/search${search}&pageNum=${pageNum}&orderBy=${order}&start=${start?start:''}&end=${end?end:''}`)
            .then(response=>response.json())
            .then(json=>{
                var { data, total}  = json.data;
                this.setState({newsList:data, count:total, isLoading:false});
            })
    } else if (type=='Topic'){
        fetch(`/api/topic/search${search}&pageNum=${pageNum}&orderBy=${order}&start=${start?start:''}&end=${end?end:''}`)
            .then(response=>response.json())
            .then(json=>{
                var { data, total } = json.data;
                this.setState({topicList:data, count:total, isLoading:false});
            })
    } else if (type=='User'){
        fetch(`/api/usr/search${search}&pageNum=${pageNum}&orderBy=${order}&start=${start?start:''}&end=${end?end:''}`)
            .then(response=>response.json())
            .then(json=>{
                var { data } = json.data;
                this.setState({userList:data, count:data.length, isLoading:false});
            })
    }
        
  }

  handlePageChange(pageNum){
    this._loadSearchList(pageNum,this.state,null,this.state.startDate,this.state.endDate);
  }

  componentWillReceiveProps(newProps){
    if (this.props.location.search != newProps.location.search){
        this.setState({isLoading:true});
        this._loadSearchList(1,null,newProps.location.search);
    }   
  }

  handleSelectChange(value){   
    this.setState({order:value});
    this.setState((state)=>{
      //console.log(state.order);
      this._loadSearchList(1,state,null,state.startDate,state.endDate);
      
    })
  }

  handleSearchType(type){
      this.setState({type,isLoading:true});
      this.setState(state=>{
          this._loadSearchList(1,state,null)
      })   
  }
  
  _updateSearchList(title){
        var pattern = /(^\s*)|(\s*$)/g;
        var title = title.replace(pattern,'');
        var searchHistory = localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory')) : [];             
        if (!searchHistory.map(item=>item.title).includes(title)){
            searchHistory.push({title})
        }             
        localStorage.setItem('searchHistory',JSON.stringify(searchHistory));
        this.setState({searchList:searchHistory});
  }

  render(){
    var { type, newsList, topicList, userList, count, value, isLoading } = this.state;
    var { location, history, socket, onUpdateSearchHistory } = this.props;
    const dropdownStyle = {
      width:'160px',
      fontSize:'12px'
    };
    return(
        <div className="search-content">
            
                
                    <SearchComponent {...this.props} forSearch={true} onUpdateSearchHistory={onUpdateSearchHistory}/>
                    <div style={{margin:'10px 0'}} className="search-option">
                        <span>{`共为您搜索${translateType(type)} ${count?count:0} ${type=='User'?'个':'条'}`}</span>             
                        <Select onChange={this.handleSelectChange.bind(this)} dropdownStyle={dropdownStyle} size="small" defaultValue={value}  dropdownMatchSelectWidth={false} disabled={type=='user'?true:false}>
                          <OptGroup label="按时间">
                            <Option value="time">从远到近</Option>
                            <Option value="timeInvert">从近到远</Option>
                          </OptGroup>
                          <OptGroup label="按热度">
                            <Option value="hot">从高到低</Option>
                            <Option value="hotInvert">从低到高</Option>
                          </OptGroup>
                        </Select>
                        <RangePicker size="small" onChange={this.handleDateChange.bind(this)} placeholder={['开始日期', '结束日期']}/>
                    </div>
                    <Tabs onChange={this.handleSearchType.bind(this)}>
                        <TabPane tab="新闻" key="Article">
                            { isLoading ? <Spin /> :<NewsList data={newsList} location={location} forSearch={true} hasSearchContent={true} text="没有搜索到符合条件的新闻!"/> }
                            { newsList.length ? <Pagination style={{paddingTop:'20px'}} hideOnSinglePage={true} showQuickJumper defaultPageSize={20} total={count} onChange={this.handlePageChange.bind(this)}/> : null }
                        </TabPane>
                        <TabPane tab="话题" key="Topic">
                            { isLoading ? <Spin /> :<TopicList data={topicList} forSearch={true} text="没有搜索到符合条件的话题!" history={history} location={location}/> }
                            { topicList.length ? <Pagination style={{paddingTop:'20px'}} hideOnSinglePage={true} showQuickJumper defaultPageSize={20} total={count} onChange={this.handlePageChange.bind(this)}/> : null }
                        </TabPane>
                        <TabPane tab="用户" key="User">
                            { isLoading ? <Spin /> : <UserList data={userList} socket={socket} history={history} text="没有找到相关的用户!"/> }
                                                  
                        </TabPane>
                    </Tabs>
                
            
       </div>      
    )
  }
}

