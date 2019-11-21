import React from 'react';
import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin, Badge } from 'antd';

import PCUserAvatar from './pc_userAvatar.js';
import PCUserCenterContainer from './pc_usercenter_container';

export default class PCUserCenter extends React.Component{
	constructor(){
		super();
		this.state={
			user:{},
			isSelf:false,
			userFollows:[],
			userFans:[],
			userCollects:[],			
			userActions:[],
			userComments:[],
			userHistorys:[],
			isLoading:true
		}
	}

	_loadUserInfo(props){
		
		var params = props.match.params.id;
		var isSelf = localStorage.getItem('userid') === params ? true :false;
		fetch(`/api/usr/usercenter?userid=${params}&isSelf=${isSelf?'true':''}`)
			.then(response=>response.json())
			.then(json=>{
				//console.log(data);
				var user = json.data;
				//console.log(responseData);
				var { userFollows, userFans, userActions, userHistorys, userCollects, } = user;				
				this.setState({user, userFollows, userFans, userActions, userCollects,  userHistorys, isSelf,isLoading:false})
		})

	}

	componentWillReceiveProps(newProps){
		var params = this.props.match.params.id;
		if ( params != newProps.match.params.id){
			this.setState({isLoading:true});
			this._loadUserInfo(newProps);
		}	
		
	}

	componentDidMount(){
		this._loadUserInfo(this.props)
	}
	
	render(){
		
		var { socket, history, match, msg } = this.props;
		var { user, userFollows, userFans, userActions, userComments, userHistorys, userCollects,  isSelf, isLoading  } = this.state;

		return(

			<div>				
				<Row style={{paddingTop:'30px'}}>
					<Col span={2}></Col>
					<Col span={20} style={{textAlign:'center'}}>
						{
							isLoading
							?
							<Spin size="large"/>
							:
							<Row>
								<Col span={8}>
									<PCUserAvatar user={user}/>
								</Col>
								<Col span={16} style={{position:'relative',textAlign:'left'}}>									
									<PCUserCenterContainer 
										userFollows={userFollows}
										userFans = {userFans}
										userActions={userActions}
										userComments={userComments}
										userHistorys={userHistorys}
										userCollects={userCollects}			
										socket={socket}
										history={history}
										match={match}
										msg={msg}
										isSelf={isSelf}
									/>
									
								</Col>	
							</Row>
						}
						
					</Col>									
					<Col span={2}></Col>
				</Row>					
			</div>

		)
	}
}



