import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin, Badge, message, Popover, Avatar } from 'antd';
import { parseDate, formatDate } from '../../../utils/translateDate';
import TopicListItem from './topic_list_item';
const { Meta } = Card;

function getMinValueOfArr(arr){
    var min = arr[0];
    for(var i=1,len=arr.length;i<len;i++){
        var temp = arr[i];
        min = temp < min ? temp:min;
    }
    return min;
}

function getMaxValueOfArr(arr){
    var max = arr[0];
    for(var i=1,len=arr.length;i<len;i++){
        var temp = arr[i];
        max = temp < max ? max : temp;
    }
    return max;
}

function getMinIndexOfArr(arr,min){
    var index = 0;
    for(var i=0,len=arr.length;i<len;i++){
        if(arr[i]===min){
            index = i;
            return index;
        }
    }
}


export default class TopicList extends React.Component{

    _sortTopicList(props){
        var { inline, forIndex, columns } = props;
        var container = this.cardContainer;
        //  仅在话题主页判断排序逻辑
        if(container && forIndex){ 
            var cardContainers = container.childNodes;
            var cardWidth = container.offsetWidth/columns;
            // 放置每一列的高度数据
            
            var cardsColHeight = [];
            if ( inline ) {
                for(var i=0,len=cardContainers.length;i<len;i++){
                    var cardContainer = cardContainers[i];                    
                    if(i<columns){      

                        cardsColHeight.push(cardContainer.offsetHeight);
                        cardContainer.style.left = i*cardWidth + 'px';
                        cardContainer.style.top = '0px';
                        
                    } else {                    
                        var minHeight = getMinValueOfArr(cardsColHeight);                    
                        var minHeightIndex = getMinIndexOfArr(cardsColHeight,minHeight);
                        cardContainer.style.left = minHeightIndex * cardWidth + 'px';
                        cardContainer.style.top = minHeight + 'px';
                        cardsColHeight[minHeightIndex] = cardsColHeight[minHeightIndex] + cardContainer.offsetHeight;
                    }
                    cardContainer.style.margin = '0';
                
                }
                
            } else {
                for(var i=0,len=cardContainers.length;i<len;i++){
                    cardContainers[i].style.left = '0px';
                    cardContainers[i].style.top = '0px';
                    cardContainers[i].style.display = 'block';
                    cardContainers[i].style.margin = '10px 0';
                }
            }
            var maxHeight = getMaxValueOfArr(cardsColHeight);
            container.style.height = maxHeight + 'px';
                       
        } 
    }

    componentDidUpdate(){
        setTimeout(()=>{
            this._sortTopicList(this.props);
        },0)  
    }

    componentDidMount(){
        var container = this.cardContainer;       
        setTimeout(()=>{
            this._sortTopicList(this.props);
        },0)       
    }
    
    render(){

        var { data, inline, columns, history, location, onCheckLogin, isSelf, forUser, forDetail, forSearch, forIndex, forMobile, params, onVisible, onEditVisible, text } = this.props;
        
        return(
            <div ref={card=>this.cardContainer=card} style={{position:'relative'}}>
            
                {
                    data.length
                    ?
                    data.map((item,index)=>(
                        <TopicListItem 
                            index={index} 
                            key={index} 
                            data={item}
                            inline={inline}
                            history={history}
                            location={location}
                            columns={columns}
                            forDetail={forDetail}
                            forIndex={forIndex}
                            forUser={forUser}
                            forMobile={forMobile}
                            params={params}
                            isSelf={isSelf}
                            forSearch={forSearch}
                            onVisible={onVisible}
                            onCheckLogin={onCheckLogin}
                            onEditVisible={onEditVisible}
                        />
                    ))
                    :
                    <div style={{padding:'10px 0'}}>{text}</div>
                }
                       
            </div>   
                       
        )
    }
}


