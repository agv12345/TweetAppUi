import React, { Component } from 'react'
import HeaderComponent from './HeaderComponent';
import './Style.css'
import UserService from '../services/UserService';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

class LoginComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            error: '',
            loginId: '',
            password: ''

        }
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    cancel = (e) => {
        e.preventDefault();
        this.props.history.push('/');
    }
    login = (e) => {
        e.preventDefault();
        this.props.history.push('/registration');
    }
    getLoginDetails = (e) => {
        e.preventDefault();
        if (this.state.loginId != '' && this.state.password != '') {
            UserService.getLogin(this.state.loginId, this.state.password).then(response => {
                console.log("Res", response)
                localStorage.setItem("loginId", response.data.data.username);
                var now = new Date().getTime();
                localStorage.setItem("token", response.data.token);
                localStorage.setItem('setupTime', now)
                this.props.history.push('/home');
            }).catch(err => {
                this.setState({ error: 'Invalid username and password' });
            });
        }
        else {
            this.setState({ error: 'Please enter the fields' });
        }
    }
    render() {
        return (
            <div className='login1'  >
                <HeaderComponent />
                <div>
                    <div className="login">
                        <h2 className="custom1"><span style={{color:"greenyellow"}}>LOGIN</span> </h2>
                        <form>
                            <div className="form-group">
                                <input placeholder="Login Id" name="loginId" className="form-control"
                                    value={this.state.loginId} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <input type="password" placeholder="Password" name="password" className="form-control"
                                    value={this.state.password} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <span className="error">{this.state.error}</span>
                            </div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="center">
                                <button className="btn btn-success" onClick={this.getLoginDetails.bind(this)}>Login</button>
                                <button className="btn btn-danger" onClick={this.cancel.bind(this)} style={{ marginLeft: "10px" }}>Cancel</button>
                                <div className="center" > <Link to="/forgetPassword"><span style={{color: "white"}}>Forgot Password</span></Link ></div>
                            </div>
                            <br></br>

                            <div className="center">
                                <span> <button className="btn btn-secondary" href='' onClick={this.login.bind()}>New User? Click Here to Register</button></span>
                            </div>


                        </form>
                    </div></div>

            </div>
        )
    }
}

export default LoginComponent