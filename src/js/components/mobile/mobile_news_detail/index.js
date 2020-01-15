import React from 'react';
import ScrollContainer from '../mobile_scroll_container';
import MobileDetailComment from '../mobile_comment';
import CommentListContainer from '../../common_comments/comments_list_container';
import { Menu, Spin, Tabs } from 'antd';
const { TabPane } = Tabs;
export default class MobileNewsDetail extends React.Component {
    
    constructor(){
        super();
        this.state = {
            isLoading:true
        }
    }

    componentDidMount(){
        var { match, user } = this.props;
        var uniquekey = match.params.uniquekey;
        fetch('/api/article/getArticleContent?uniquekey='+uniquekey)
            .then(response=>response.json())
            .then(json=>{
                    var data = json.data;
                    this.setState({newsItem:data,isLoading:false});                    
                    document.title = this.state.newsItem.title + " -React News | React驱动的新闻平台";
            }); 
        if( user&& user.userid){
            fetch(`/api/usr/pushHistory?uniquekey=${uniquekey}&userid=${user.userid}`)
        }       
    }
    
    createMarkup(){ 
        var { newsItem } = this.state;
        return {__html:newsItem.content};
    }

    render(){
        var { history, match, location, socket, user, onCheckLogin } = this.props;
        var { isLoading, newsItem } = this.state;
        var uniquekey = match.params.uniquekey;
        return (
            <div>
                {
                    isLoading
                    ?
                    <Spin className="spin"/>
                    :
                    <ScrollContainer>
                        <div style={{textAlign:'left'}}>                                                                
                            <div className="article-container" dangerouslySetInnerHTML={this.createMarkup()} ></div>
                            <CommentListContainer 
                                commentType="Article" 
                                onCheckLogin={onCheckLogin} 
                                history={history} 
                                socket={socket} 
                                location={location} 
                                uniquekey={uniquekey} 
                                item={newsItem} 
                                forMobile={true}
                                warnMsg="还没有用户评论呢!快来抢沙发吧～" 
                            />                                
                        </div>
                    </ScrollContainer>
                }
                
                <MobileDetailComment user={user} onCheckLogin={onCheckLogin} uniquekey={uniquekey} type="Article" item={newsItem}/>
            </div>            
                      
                   
        )
    }
}






