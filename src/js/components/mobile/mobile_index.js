import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';

import AutoCarousel from '../autoCarousel';
import NewsList from '../news_list/news_list';
import { Menu, Spin } from 'antd';

export default class MobileNewsContainer extends React.Component {
    
    constructor(){
        super();
        this.state = {
            newsList:[],
            isLoading:true
        }

    }
    componentDidMount(){
        console.log('hello');
        fetch('/api/article/getArticleList?type=yule&count=20')
        .then(response=>response.json())
        .then(json=>{
            var data = json.data;
            this.setState({newsList:data,isLoading:false});       
        })
    }

    render(){
        
        var { isLoading, newsList } = this.state;
        console.log(newsList);
        return (
                   
                <div>
                    <div style={{height:'200px'}}>
                        <AutoCarousel count={4} size="small"/>
                    </div>
                    
                        {
                            isLoading
                            ?
                            <Spin/>
                            :
                            <NewsList data={newsList} hasImg={true}/>
                        }
                    
               
                    <div>
                        <span>hot news</span>
                        <span>hot topics </span>
                    </div>

                </div>
            
        )
    }
}






