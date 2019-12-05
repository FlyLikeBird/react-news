import React from 'react';
import { Row, Col, BackTop, Button, Icon, Tooltip, Popover, Modal, Input, Form, Select, Card, Collapse } from 'antd';

import NewsListItem from '../news_list/news_list_item';
import TopicListInnerItem from '../topic_list/topic_list_inner_item';


export default class CollectContentItem extends React.Component {
    

    render(){
        var { data, forSimple } = this.props;
        var { onModel, contentId, addtime } = data;
        
        return(
            <div style={{borderRadius:'4px', padding:'20px',backgroundColor:forSimple ? '#fff' : '#f7f7f7', margin:'10px 0'}}>
                {
                    onModel === 'Article'
                    ?
                    <NewsListItem data={contentId} hasImg={true} forSimple={true} />
                    :
                    onModel === 'Topic'
                    ?
                    <TopicListInnerItem data={contentId} forSimple={true}/>
                    :
                    null
                }
            </div>

        )
    }
}

