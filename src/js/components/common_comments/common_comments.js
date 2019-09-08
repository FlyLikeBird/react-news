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

						<CommentsListContainer {...this.props} uniquekey={uniquekey} hasCommentInput={true} text="还没有人评论呢!,快来抢沙发吧" shareType="comment"/>					
						
					</Col>
				</Row>
			</div>
			
			
		)
		
	}
}


