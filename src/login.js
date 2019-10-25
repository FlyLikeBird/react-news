
import React from 'react';
import ReactDOM from 'react-dom';
import LoginContainer from './js/components/pc/pc_login_container';

export default class LoginPage extends React.Component {
    
    render(){
        
        return (

            <div>
              <LoginContainer modalVisible={true}/>
            </div>
          
        )
    }
}


ReactDOM.render(
    <Root/>,
    document.getElementById('login')
)






