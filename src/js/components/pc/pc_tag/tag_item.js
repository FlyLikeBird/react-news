import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, List, Spin } from 'antd';

import tagStyle from './style.css';

export default class TagItem extends React.Component {

    render() {

        var { item } = this.props;
        var { title, uniquekey, newstime, auth, type, content, thumbnail } = item;
        
        return (
            <div className={tagStyle.container}>
                <Link to={`/details/${uniquekey}`}><span className={tagStyle.title}>{title}</span></Link>         
                <div className={tagStyle['text-container']}>
                    <span className={tagStyle.text}>发布时间: <span className="mark">{newstime}</span></span>
                    <span className={tagStyle.text}>来源: <span className="mark">{auth}</span></span>
                    <span className={tagStyle.text}>类型: <span className="mark">{type}</span></span>
                </div>
                <p className={tagStyle.content}>{content}</p>      
                <div>
                    {
                        thumbnail && thumbnail.length 
                        ?
                        thumbnail.map((imgSrc,index)=>(
                          <span className={tagStyle['img-container']} key={index}><img src={imgSrc}/></span>
                        ))
                        :
                        null
                    }
                </div>
            </div>

            
        )
        
    }

}











