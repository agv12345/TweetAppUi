import React, { Component } from 'react';
import { Button } from 'primereact/button';

class HomeComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
                 
        }
    }
logout=(e)=>{
    e.preventDefault();
    localStorage.removeItem('loginId');
    this.props.history.push('/');

}
setData() {
    return localStorage.getItem('loginId');

}
    render() {
        return (
            <div>
              <nav className="navbar navbar-default navbar-dark bg-dark">
                    <ul className="nav navbar-nav"><li><a href="" className="navbar-brand">Tweet app App</a></li></ul>
                    <ul className="nav navbar-nav text">
                     <li><a href="" className="navbar-brand"><Button icon="pi pi-users" iconPos="right" label='Users' title="users" onClick={this.logout.bind(this)}/></a></li>
                     <li><a href="" className="navbar-brand"><Button  icon="pi pi-plus" iconPos="right" label='Post Tweet' title="post tweet" onClick={this.logout.bind(this)}/></a></li>
                    <li ><a href="" className="navbar-brand ">{this.setData()}</a></li>
                    <li><a href="" className="navbar-brand"><Button icon="pi pi-sign-out" iconPos="right" title="logout" onClick={this.logout.bind(this)}/></a></li>
                    </ul>
                    </nav> 
            </div>
        )
    }
}

export default UserComponent
