import React from 'react';
import { Row, Col } from 'antd';
import CommentsListContainer from './comments_list_container';


export default class CommentsContainer extends React.Component{
	
	render(){
		var  uniquekey   = this.props.match.params.uniquekey;
		return(
			<div className="comment">
				<Row>
					<Col span={24}>

						<CommentsListContainer {...this.props} uniquekey={uniquekey} commentType="news" hasCommentInput={true} warnMsg="还没有用户评论呢!快来抢沙发吧～" shareType="news"/>					
						
					</Col>
				</Row>
			</div>
			
			
		)
		
	}
}


