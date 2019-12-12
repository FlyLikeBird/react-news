import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, List, Spin } from 'antd';
import ImgContainer from '../../img_container';
import style from './tag_item.style.css';

export default class TagItem extends React.Component {

    render() {

        var { item } = this.props;
        var { title, _id, newstime, auth, type, content, thumbnails } = item;
        
        return (
            
                
                <div className={style.container}>
                    <Link to={`/details/${_id}`}><span className={style.title}>{title}</span></Link>         
                    <div className={style['text-container']}>
                        <span className={style.text}>发布时间: <span className="mark">{newstime}</span></span>
                        <span className={style.text}>来源: <span className="mark">{auth}</span></span>
                        <span className={style.text}>类型: <span className="mark">{type}</span></span>
                    </div>
                    <p className={style.content}>{content}</p>      
                    <div>
                        {
                            thumbnails && thumbnails.length 
                            ?
                            thumbnails.map((imgSrc,index)=>(
                                <ImgContainer key={index} bg={imgSrc}/>
                            ))
                            :
                            null
                        }
                    </div>
                </div>
            
            
        )
        
    }

}











