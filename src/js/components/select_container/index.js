import React from 'react';
import { Select, DatePicker } from 'antd';
import { parseDate, formatDate, translateType } from '../../../utils/translateDate';
const { RangePicker } = DatePicker;
var { Option, OptGroup } = Select;
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
            if ( onSelect ) onSelect(data, value, []);
        } else if (value ==='Self'){
            var arr = data.filter(item=>item.isCreated);
            if (onSelect) onSelect(arr, value, []);
        } else {
            var arr = data.filter(item=>item.onModel===value);
            if ( onSelect ) onSelect(arr, value, []);
        }   
        this.setState({lock:false});  
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
        var { text, currentData, selectValue, dateValue, forAction } = this.props;
        const dropdownStyle = {
          width:'160px',
          fontSize:'12px'
        };

        var selectContent = forAction 
                    ?
                    <Select className={style['user-select']} onChange={this.handleSelectChange.bind(this)} dropdownStyle={dropdownStyle} size="small" value={selectValue} dropdownMatchSelectWidth={false}>
                        <Option value="all">全部动态</Option>
                        <Option value="Self">自己发布的</Option>
                        <Option value="Article">转发新闻</Option>
                        <Option value="Topic">转发话题</Option>
                        <Option value="Collect">转发收藏夹</Option>
                        <Option value="Action">转发动态</Option>
                    </Select>
                    :
                    <Select className={style['user-select']} onChange={this.handleSelectChange.bind(this)} dropdownStyle={dropdownStyle} size="small" value={selectValue} dropdownMatchSelectWidth={false}>
                        <Option value="all">全部评论</Option>
                        <Option value="Article">新闻评论</Option>
                        <Option value="Topic">话题评论</Option>
                        <Option value="Action">动态评论</Option>
                    </Select>
        
        
        return(
            <div className={style["select-container"]}>
                <span className={style.text}>{`${forAction?selectValue=='all'?'共发布':selectValue=='Self'? '自己发布':'转发':'共发布'}`}<span className={style.num}>{ currentData.length}</span>{`条${forAction ?'':selectValue=='all'?'':translateType(selectValue)}${forAction?selectValue=='all' || selectValue=='Self'?'动态':translateType(selectValue):text}`}</span>
                { selectContent }
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


