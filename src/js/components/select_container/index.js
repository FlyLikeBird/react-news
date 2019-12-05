import React from 'react';
import { Select, DatePicker } from 'antd';
import { parseDate, formatDate, translateType } from '../../../utils/translateDate';
const { RangePicker } = DatePicker;

import style from './style.css';

export default class SelectContainer extends React.Component{
    constructor(){
        super();
        this.state={
           allComments:[]
        }
    }
    
    componentDidMount(){
        var { data } = this.props;
        this.setState({allComments:data});
    }

    handleSelectChange(value){
        var { data, onSelect } = this.props;
        var { allComments } = this.state;
        if ( value ==='all') {
            if ( onSelect ) onSelect(allComments, value);
        } else {
            var arr = allComments.filter(item=>item.onModel===value);
            if ( onSelect ) onSelect(arr, value);
        }     

    }

    handleDateChange(date,datestring){
        console.log(date);
        console.log(datestring);
        //this.setState({startDate:datestring[0],endDate:datestring[1]});
    }

    render(){
        var { text, data, value } = this.props;
        const dropdownStyle = {
          width:'160px',
          fontSize:'12px'
        };
        return(
            <div className={style["select-container"]}>
                <span className={style.text}>共发布<span className={style.num}>{ data.length}</span>{`条${value=='all'?'':translateType(value)}${text}`}</span>
                <Select className={style['user-select']} onChange={this.handleSelectChange.bind(this)} dropdownStyle={dropdownStyle} size="small" defaultValue={value}  dropdownMatchSelectWidth={false}>
                    <Select.Option value="all">全部评论</Select.Option>
                    <Select.Option value="Article">新闻评论</Select.Option>
                    <Select.Option value="Topic">话题评论</Select.Option>
                    <Select.Option value="Action">动态评论</Select.Option>
                </Select>
                <RangePicker 
                    className={style["user-date-picker"]} 
                    size="small" 
                    onChange={this.handleDateChange.bind(this)} 
                    placeholder={['开始日期', '结束日期']}
                    /> 
            </div>
                   
        )
    }
}


