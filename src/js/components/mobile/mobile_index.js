import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';

import NewsList from '../news_list/news_list';
import MobileFooter from './mobile_footer';
import { Menu, Spin } from 'antd';

export default class MobileIndex extends React.Component {
    
    constructor(){
        super();
        this.state = {
            newsList:[],
            isLoading:true
        }

    }
    
    render(){
        
        var { isLoading, newsList } = this.state;
        console.log(newsList);
        return (
                   
                <div style={{overflowY:'scroll',overflowX:'hidden',height:'100%'}}>
                    <div style={{height:'200px'}}>
                        
                    </div>
                    <div>
                        <div>新闻中心</div>
                        <div>话题中心</div>
                    </div>
                        
                    <MobileFooter />
                    
                </div>
            
        )
    }
}






