import React, { Component } from 'react';
import PostService from '../services/PostService';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ToastContainer, toast } from 'react-toastify'

class ResetPasswordComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showPasswordDialog: true,
            message: '',
            error: '',
            newPassword: '',
            oldPassword: ''


        }


    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    onHide() {
        this.setState({ showPasswordDialog: false });
    }

    logout = () => {
        localStorage.clear();
        console.log("props logout", this.props);
        // this.props.history.goBack();
        toast.warn("Session TimmeOut!!! Please Login Again.", { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
        setTimeout(3000);
        window.location.href = '/';
    }

    login = (e) => {
        e.preventDefault();
        this.props.history.push('/');
    }
    savePassword() {
        if (this.state.oldPassword != '' && this.state.newPassword != '') {
            PostService.resetPassword(this.state.oldPassword, this.state.newPassword).then(reponse => {
                if (reponse === "TokenNotValid") {
                    this.logout();
                }
                this.setState({ message: "Password changed successfully" });
                this.setState({ error: '' });
                //this.setState({showPasswordDialog:false});
                this.login.bind(this);
            }).catch(err => {
                let error = err.message;
                if (error == "Request failed with status code 500") {
                    this.setState({ error: "Please enter correct old Password" });
                }
            })

        }
        else {
            this.setState({ error: "Please enter the fields" });
        }

    }

    renderFooter() {
        return (
            <div>
                <Button label="Cancel" onClick={() => this.onHide()} className="p-button-text" />
                <Button label="Reset" onClick={() => this.savePassword()} autoFocus />
            </div>
        );
    }
    render() {
        return (
            <div>
                <ToastContainer autoClose={3000} />
                <Dialog header="Reset Password" footer={this.renderFooter()} visible={this.state.showPasswordDialog} style={{ width: '30vw' }}>
                    <br /><input placeholder="Enter OldPassword" name="oldPassword" className="form-control"
                        value={this.state.oldPassword} onChange={this.handleChange} />
                    <br /><input placeholder="Enter NewPassword" name="newPassword" className="form-control"
                        value={this.state.newPassword} onChange={this.handleChange} />
                    <br /><span className="error"> {this.state.error}</span>
                    <span className="message"> {this.state.message}</span>
                </Dialog>
            </div>
        )
    }
}

export default ResetPasswordComponent
