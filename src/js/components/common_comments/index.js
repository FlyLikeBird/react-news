import React from 'react';
import { Row, Col } from 'antd';
import CommentsListContainer from './comments_list_container';


export default class CommentsContainer extends React.Component{
	
	render(){
		return(
			<div className="comment">
				<Row>
					<Col span={24}>

						<CommentsListContainer {...this.props} commentType="news" hasCommentInput={true} warnMsg="还没有用户评论呢!快来抢沙发吧～"/>					
						
					</Col>
				</Row>
			</div>
			
			
		)
		
	}
}


