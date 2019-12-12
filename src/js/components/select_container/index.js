import React from 'react';
import { Select, DatePicker } from 'antd';
import { parseDate, formatDate, translateType } from '../../../utils/translateDate';
const { RangePicker } = DatePicker;

import style from './style.css';

export default class SelectContainer extends React.Component{
    
    constructor(){
        super();
        this.state = {
            prevData:[],
            lock:false  // 保证setState({prevData:currentData})只执行一次
        }
    }

    handleSelectChange(value){
        var { currentData, data, onSelect } = this.props;
        if ( value ==='all') {
            if ( onSelect ) onSelect(data, value);
        } else {
            var arr = data.filter(item=>item.onModel===value);
            if ( onSelect ) onSelect(arr, value);
        }   
        this.setState({dateValue:[],lock:false});  
    }

    handleDateChange(date,datestring){
        var { currentData, onSelect, selectValue } = this.props;
        var { prevData, lock } = this.state;
        if (!lock){
            this.setState({prevData:currentData, lock:true});
        }
        if ( date.length && datestring && datestring[0]) {
            var startTime = Date.parse(datestring[0]);
            var endTime = Date.parse(datestring[1]);           
            var arr = currentData.filter(item=>{
                var commentTime = Date.parse(item.date);
                return commentTime >= startTime && commentTime <= endTime;
            }) ;
            
            if ( onSelect ) onSelect(arr, selectValue, date);
        } else {
            // 取消日期筛选
            if (onSelect) onSelect(prevData, selectValue, []);
        }     
    }

    render(){
        var { text, currentData, selectValue, dateValue } = this.props;
        const dropdownStyle = {
          width:'160px',
          fontSize:'12px'
        };
        return(
            <div className={style["select-container"]}>
                <span className={style.text}>共发布<span className={style.num}>{ currentData.length}</span>{`条${selectValue=='all'?'':translateType(selectValue)}${text}`}</span>
                <Select className={style['user-select']} onChange={this.handleSelectChange.bind(this)} dropdownStyle={dropdownStyle} size="small" value={selectValue} dropdownMatchSelectWidth={false}>
                    <Select.Option value="all">全部评论</Select.Option>
                    <Select.Option value="Article">新闻评论</Select.Option>
                    <Select.Option value="Topic">话题评论</Select.Option>
                    <Select.Option value="Action">动态评论</Select.Option>
                </Select>
                <RangePicker 
                    className={style["user-date-picker"]} 
                    size="small" 
                    value={dateValue}
                    onChange={this.handleDateChange.bind(this)} 
                    placeholder={['开始日期', '结束日期']}
                    /> 
            </div>
                   
        )
    }
}


