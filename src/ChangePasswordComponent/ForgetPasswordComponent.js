import React, { Component } from 'react'
import HeaderComponent from '../Component/HeaderComponent';
import '../Component/Style.css'
import UserService from '../services/UserService';
import { ToastContainer, toast } from 'react-toastify'

class ForgetPasswordComponent extends React.Component {
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

    logout = () => {
        localStorage.clear();
        console.log("props logout", this.props);
        // this.props.history.goBack();
        toast.warn("Session TimmeOut!!! Please Login Again.", { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
        setTimeout(3000);
        window.location.href = '/';
    }

    getLoginDetails = (e) => {
        e.preventDefault();
        if (this.state.loginId != '' && this.state.password != '') {
            UserService.forgetPassword(this.state.loginId, this.state.password).then(response => {
                if (response === "TokenNotValid") {
                    this.logout();
                }

                this.props.history.push('/forgetPasswordSuccess');
            }).catch(err => {
                let error = err.message;
                if (error == "Request failed with status code 500") {
                    this.setState({ error: "LoginId is incorrect" });
                }
            });
        }
        else {
            this.setState({ error: 'Please enter the fields' });
        }
    }
    render() {
        return (
            <div>
                <HeaderComponent />
                <div>
                <ToastContainer autoClose={3000} />
                    <div className="login">
                        <h2 className="center">Forget Password</h2>
                        <form>
                            <div className="form-group">
                                <input placeholder="Enter Login Id" name="loginId" className="form-control"
                                    value={this.state.loginId} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <input type="password" placeholder="Enetr New Password" name="password" className="form-control"
                                    value={this.state.password} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <span className="error">{this.state.error}</span>
                            </div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                            <button className="btn btn-success" onClick={this.getLoginDetails.bind(this)}>submit</button>

                        </form>
                    </div></div>

            </div>
        )
    }
}

export default ForgetPasswordComponent
