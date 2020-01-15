import React from 'react';
import { Form, Input, Select, Icon, Tabs, Spin, message, Pagination, DatePicker } from 'antd';
import NewsList from '../../news_list/news_list';
import TopicList from '../../topic_list/topic_list';
import UserList from '../../user_list/user_list';
import { parseDate, formatDate, translateType } from '../../../../utils/translateDate';

const { TabPane } = Tabs;
const { Option, OptGroup } = Select;
const Search = Input.Search;
const { RangePicker } = DatePicker;

import style from './mobile_search_style.css';

export default class SearchResult extends React.Component {
    constructor(){
        super();
        this.state = {
            newsList:[],
            topicList:[],
            userList:[],
            count:0,
            pageNum:1,
            type:'Article',
            order:'time',
            start:'',
            end:'',
            isLoading:true
        }
    }

    componentDidMount(){
        this._loadSearchList(this.props, this.state);
    }

    _loadSearchList(props, state){  
        var { params } = props;
        var { pageNum, type, order, start, end } = state;
        
        if (type=='Article'){
            fetch(`/api/article/search?words=${params}&pageNum=${pageNum}&orderBy=${order}&start=${start?start:''}&end=${end?end:''}`)
                .then(response=>response.json())
                .then(json=>{
                    var { data, total}  = json.data;
                    this.setState({newsList:data, count:total, isLoading:false});
                })
        } else if (type=='Topic'){
            fetch(`/api/topic/search?words=${params}&pageNum=${pageNum}&orderBy=${order}&start=${start?start:''}&end=${end?end:''}`)
                .then(response=>response.json())
                .then(json=>{
                    var { data, total } = json.data;
                    this.setState({topicList:data, count:total, isLoading:false});
                })
        } else if (type=='User'){
            fetch(`/api/usr/search?words=${params}&pageNum=${pageNum}&orderBy=${order}&start=${start?start:''}&end=${end?end:''}`)
                .then(response=>response.json())
                .then(json=>{
                    var { data } = json.data;
                    this.setState({userList:data, count:data.length, isLoading:false});
                })
        }
          
    }

    handleSearchType(type){
        this.setState({type,isLoading:true});
        this.setState(state=>{
            this._loadSearchList(this.props, state);
        })  
    }

    handleSelectChange(value){
        this.setState({order:value});
        this.setState((state)=>{
          this._loadSearchList(this.props,state);
          
        })
    }

    handlePageChange(){

    }

    handleDateChange(date,datestring){
        this.setState({start:datestring[0],end:datestring[1]});
        this.setState((state)=>{
            this._loadSearchList(this.props, state);
        })
    }

    componentWillReceiveProps(newProps){
        if (this.props.params != newProps.params){
            this._loadSearchList(newProps, this.state);
        }
    }
    componentDidMount(){
        this._loadSearchList(this.props, this.state);
    }

    render() {
        var { newsList, topicList, userList, isLoading, type, order, count } = this.state;
        var { params, location, history, socket } = this.props;

        const dropdownStyle = {
          width:'160px',
          fontSize:'12px'
        };
        return (
            <div>
                <div className={style['search-option']}>
                    <span>{`共为您搜索${translateType(type)} ${count?count:0} ${type=='User'?'个':'条'}`}</span>             
                    <Select style={{margin:'0 4px'}} onChange={this.handleSelectChange.bind(this)} dropdownStyle={dropdownStyle} size="small" defaultValue={order}  dropdownMatchSelectWidth={false} disabled={type=='user'?true:false}>
                      <OptGroup label="按时间">
                        <Option value="time">从远到近</Option>
                        <Option value="timeInvert">从近到远</Option>
                      </OptGroup>
                      <OptGroup label="按热度">
                        <Option value="hot">从高到低</Option>
                        <Option value="hotInvert">从低到高</Option>
                      </OptGroup>
                    </Select>
                    <br/>
                    <RangePicker size="small" style={{margin:'10px 0'}} onChange={this.handleDateChange.bind(this)} placeholder={['开始日期', '结束日期']}/>
                </div>
                <Tabs onChange={this.handleSearchType.bind(this)}>
                    <TabPane tab="新闻" key="Article">
                        { isLoading ? <Spin /> :<NewsList data={newsList} history={history} location={location} forSearch={true} forMobile={true} params={params} hasSearchContent={true} text="没有搜索到符合条件的新闻!"/> }
                        { newsList.length ? <Pagination style={{paddingTop:'20px'}} hideOnSinglePage={true} showQuickJumper defaultPageSize={20} total={count} onChange={this.handlePageChange.bind(this)}/> : null }
                    </TabPane>
                    <TabPane tab="话题" key="Topic">
                        { isLoading ? <Spin /> :<TopicList data={topicList} forSearch={true} forMobile={true} params={params} text="没有搜索到符合条件的话题!" history={history} location={location}/> }
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










