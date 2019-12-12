import React from 'react';
import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin , Button } from 'antd';
import { once } from '../../../../utils/translateDate';
import TopNewsContainer from './topnews_container';
var arr = ['guonei','yule','guoji','shehui'];

var count = 0; // 记录自动加载的次数
export default class PCTopNewsIndex extends React.Component{
    constructor(){
        super();
        this.state={
           data:[],
           addData:[],
           isLoading:true,
           loadEnd:false      
        }
    }

    _fetchData(type){
        return new Promise((resolve, reject)=>{
            fetch(`/api/article/getArticleTitle?type=${type}&count=20`)
                .then(response=>response.json())
                .then(json=>{
                    var { data } = json;
                    resolve(data);
                })
        })      
    }

    componentDidMount(){
        var { onLoadScrollFunc } = this.props;
        var container = this.container;
        var promises = arr.map(item=>this._fetchData(item));
        Promise.all(promises)
            .then(newsList=>{
                var data = newsList.concat(newsList);
                this.setState({data, addData:data, isLoading:false});
                if ( onLoadScrollFunc) onLoadScrollFunc(true);
            })   
    }

    componentWillUnmount(){
        var { onLoadScrollFunc, onResetFixed } = this.props;
        if (onLoadScrollFunc) onLoadScrollFunc(false);
        if (onResetFixed) onResetFixed();
    }

    componentWillReceiveProps(newProps){
        var { reloading, onStopAutoLoad } = newProps;
        //console.log(reloading);
        if(reloading){
            count++;
            if (count==4){
                if ( onStopAutoLoad) onStopAutoLoad(false,false);
                this.setState({loadEnd:true});
                return ;
            }
            //console.log(count);
            var promise = new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    this._reloadNewsList();
                    resolve();
                },500)
            });
            promise.then(()=>{
                if (onStopAutoLoad) onStopAutoLoad(true,false);
            });
            
            
        }
    }

    _reloadNewsList(){
        var { data, addData } = this.state;
        data = data.map((item,index)=>{
            var arr = item.concat(addData[index]);
            return arr;
        })
        this.setState({data});
    }

    
    render(){
        var { isFixed, history, reloading } = this.props;
        var { isLoading, data, addData, loadEnd } = this.state;
        
        return(

             
            <div style={{paddingTop:'30px',display:'flex'}}>
                <Col span={2}></Col>                   
                <Col span={20}>
                    {
                        isLoading
                        ?
                        <Spin size="large"/>
                        :
                        <TopNewsContainer data={data} imgData={addData} isFixed={isFixed} reloading={reloading} loadEnd={loadEnd} history={history}/>
                    }
                    
                   
                </Col>                   
                <Col span={2}></Col>
            </div>
                    
                
            

        )
    }
}


