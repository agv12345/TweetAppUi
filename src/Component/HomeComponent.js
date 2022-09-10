import React, { Component } from 'react';
import { Button } from 'primereact/button';
import UserService from '../services/UserService';
import PostService from '../services/PostService';
import { Dialog } from 'primereact/dialog';
import ViewTweetComponent from '../TweetComponent/ViewTweetComponent';
import ViewMyTweetComponent from '../TweetComponent/ViewMyTweetComponent';
import ResetPasswordComponent from '../ChangePasswordComponent/ResetPasswordComponent';
import { ToastContainer, toast } from 'react-toastify'

class HomeComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showUser: false,
      showSearchUser: false,
      showAllTweet: true,
      showUserTweet: false,
      showPasswordReset: false,
      users: [],
      searchUser: {},
      searchData: '',
      message: '',
      searchMessage: '',
      showPostTweet: false,
      tweetData: {},
      error: '',
      postError: ''

    }
  }
  logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    this.props.history.push('/');

  }

  logoutToken = () => {
    localStorage.clear();
    console.log("props logout", this.props);
    // this.props.history.goBack();
    toast.warn("Session TimmeOut!!! Please Login Again.", { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
    // setTimeout(3000);
    this.props.history.push('/');
  }

  setData() {
    return localStorage.getItem('loginId');

  }
  displayPostTweet = (e) => {
    this.setState({ showPostTweet: true });
    this.setState({ postError: '' });
    this.setState({ tweetData: {} });

  }
  displayPasswordReset = (e) => {
    this.setState({ showPasswordReset: true });
  }
  handleChange = (e) => {
    this.setState({ searchData: e.target.value })
  }
  handleTweetChange = (e) => {
    let tweet = this.state.tweetData;
    tweet["tweetData"] = e.target.value;
    this.setState({ tweet })
  }

  getAllUsers = (e) => {
    e.preventDefault();
    this.setState({ message: '' });
    UserService.getUser().then(response => {
      if (response === "TokenNotValid") {
        this.logoutToken();
      }
      this.setState({ users: response.data });
      console.log(this.state.users);
      if (this.state.users == []) {
        this.setState({ message: "No User Found" });
      }

    });
    this.setState({ showUser: true });
    this.setState({ showSearchUser: false });
    this.setState({ showPostTweet: false });
    this.setState({ showAllTweet: false });
    this.setState({ showUserTweet: false });
  }
  getUserSearch = (e) => {
    e.preventDefault();
    this.setState({ searchMessage: '' });
    UserService.getUserSearch(this.state.searchData).then(response => {
      if (response === "TokenNotValid") {
        this.logoutToken();
      }
      this.setState({ searchUser: response.data });
      this.setState({ users: response.data });
      console.log("user search", response.data)
      console.log(this.state.users);
      if (this.state.searchUser == []) {
        this.setState({ searchMessage: "No User Found" });
      }

    });
    this.setState({ showUser: true });
    this.setState({ showSearchUser: true });
    this.setState({ showPostTweet: false });
    this.setState({ showAllTweet: false });
    this.setState({ showUserTweet: false });

  }
  getAllTweet = (e) => {
    e.preventDefault();
    this.setState({ showUser: false });
    this.setState({ showSearchUser: false });
    this.setState({ showPostTweet: false });
    this.setState({ showAllTweet: true });
    this.setState({ showUserTweet: false });


  }
  getUserTweet = (e) => {
    e.preventDefault();
    this.setState({ showUser: false });
    this.setState({ showSearchUser: false });
    this.setState({ showPostTweet: false });
    this.setState({ showAllTweet: false });
    this.setState({ showUserTweet: true });


  }
  onHide() {
    this.setState({ showPostTweet: false });
  }
  saveTweet() {
    //e.preventDefault();
    this.setState({ postError: '' });
    let tweet = this.state.tweetData;
    if (tweet["tweetData"].length <= 144) {
      PostService.postTweet(tweet).then(response => {

        if (response === "TokenNotValid") {
          console.log("res", response);
          console.log("props", this.props);
          this.logoutToken();
        }

      });
      this.setState({ showPostTweet: false });
      this.setState({ showUserTweet: true });
      console.log(tweet);
    }
    else {
      this.setState({ postError: 'Message size is long' });
    }
  }
  renderFooter() {
    return (
      <div>
        <Button label="Cancel" onClick={() => this.onHide()} className="p-button-text" />
        <Button label="Post" onClick={() => this.saveTweet()} autoFocus />
      </div>
    );
  }


  render() {
    return (
      <div>
        <nav className="navbar navbar-default navbar-dark bg-dark">
          <ul className="nav navbar-nav"><li><a href="" className="navbar-brand">Tweet App</a></li></ul>
          <ul className="nav navbar-nav search"><li> <input placeholder="UserName" name="searchData" className="form-control"
            value={this.state.searchData} onChange={this.handleChange} /></li><li>
              &nbsp;<button className="btn btn-success" onClick={this.getUserSearch.bind(this)}>Search</button>
            </li></ul>
          <ul className="nav navbar-nav text">
            <li><Button className="p-button-rounded "  icon="pi pi-users" label='Users' title="view users" onClick={this.getAllUsers.bind(this)} /></li>&nbsp;&nbsp;&nbsp;
            <li><Button className=" p-button-rounded" icon="pi pi-plus"  label='Post Tweet' title="post tweet" onClick={this.displayPostTweet.bind(this)} /></li>&nbsp;&nbsp;&nbsp;
            <li >
              <div class="dropdown">
                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {this.setData()}
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" href="#" onClick={this.getUserTweet.bind(this)}>View MyTweet</a>
                  <a class="dropdown-item" href="#" onClick={this.getAllTweet.bind(this)}>View AllTweet</a>
                  <a class="dropdown-item" href="#" onClick={this.logout.bind(this)}><i class="pi pi-sign-out">&nbsp;logout</i></a>
                </div>
              </div>
            </li></ul></nav>
            <ToastContainer autoClose={3000} />
        {this.state.showUser && <div className="user">
          <h3 className="center">Users</h3><br />
          <div className="center">{this.state.message}</div>
          <table className="table table-striped ">
            <th>
              Email
            </th>
            <th>First Name</th>
            <th>Last Name</th>
            {

              this.state.users.map(
                user =>
                  <tr key={user.username}>
                    <td>{user.username}</td>
                    <td>  {user.firstName} </td>
                    <td> {user.lastName}</td>
                    {/* <td>{user.dob}</td> */}
                  </tr>)}
          </table>
        </div>}
        {this.state.showSearchUser && <div>
          {/* <h3 className="center">Users</h3><br /> */}
          <div className="center">{this.state.searchMessage}</div>
          <table className="table table-striped ">
            {<tr >
              <td>{this.state.searchUser.username}</td>
              <td>  {this.state.searchUser.firstName} </td>
              <td> {this.state.searchUser.lastName}</td>

            </tr>}
          </table></div>}
        <Dialog header="Post Tweet" footer={this.renderFooter()} visible={this.state.showPostTweet} style={{ width: '50vw' }}>
          <br /><input placeholder="Enter Post" name="tweetData" className="form-control"
            value={this.state.tweetData["tweetData"]} onChange={this.handleTweetChange} />
          <br /><span className="error"> {this.state.postError}</span>
        </Dialog>

        {this.state.showAllTweet && <div className="user">
          <ViewTweetComponent props={this.props} /></div>}
        {this.state.showUserTweet && <div className="user">
          <ViewMyTweetComponent /></div>}
        {this.state.showPasswordReset && <div>
          <ResetPasswordComponent /></div>}

      </div>
    )
  }
}

export default HomeComponent
