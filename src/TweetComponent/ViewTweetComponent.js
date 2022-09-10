import React, { Component, useRef } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import PostService from '../services/PostService';
import logo from '../image/download.png';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './TweetStyle.css';
import { Dialog } from 'primereact/dialog';
import { withRouter } from "react-router";
import { useHistory } from 'react-router-dom';


class ViewTweetComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tweets: [],
            showReplyTweet: false,
            replyTweets: [],
            reply: {},
            message: '',
            layout: 'list',
            tweetId: '',
            error: '',
            RepliedTweetId: ''

        };
        this.itemTemplate = this.itemTemplate.bind(this);

    }

    getReplyTweet(tweetId, tweetData) {
        var replyData = [];

        tweetData.forEach((element, key) => {
            replyData[key] = {
                comment: element.comment,
                dateTime: element.dateTime,
                id: element.id,
                tweetId: element.tweetId,
                username: element.users.username
            }
            console.log("reply Arr", replyData[key]);
        });

        this.setState({ replyTweets: replyData }, () => {
            this.setState({ showReplyTweet: true });
        });
        // await this.setState({showReplyTweet:true});
        // this.setState({message:tweetData.comment});
        this.setState({ tweetId: tweetId });
        this.setState({ reply: {} });
        this.setState({ error: '' });

        console.log("State Reply", this.state.replyTweets)

    }
    saveReplyTweet() {
        var user = localStorage.getItem('loginId');

        // const el = document.getElementById('hiddenTweetID').innerHTML;
        let el= this.state.tweetId;
        console.log("id ",el);
        this.setState({ error: '' });
      

        let reply = this.state.reply;
        if (reply["tweetData"].length <= 144) {
            reply["tweetTime"] = new Date().toISOString();
            console.log(reply);
            PostService.saveReplyTweet(reply, el).then(response => {
                if (response === "TokenNotValid") {
                    this.logout();
                }
                this.onHide();

            });
        }
        else {
            this.setState({ error: 'Message size is long' });
        }
    }
    
    logout = () => {
        localStorage.clear();
        console.log("props logout", this.props);
        // this.props.history.goBack();
        toast.warn("Session TimmeOut!!! Please Login Again.", { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
        setTimeout(3000);
        window.location.href = '/';
    }
    
    componentDidMount() {
        PostService.getAllTweet().then(response => {
            if (response === "TokenNotValid") {
                console.log("res", response);
                console.log("props", this.props);
                this.logout();
            }
            this.setState({ tweets: response.data });

        })
    }

    saveLike(id) {
        var user = localStorage.getItem('loginId');
        console.log("like", user, "id", id);
        PostService.saveLike(user, id).then(response => {
            if (response === "TokenNotValid") {
                console.log("res", response);
                console.log("props", this.props);
                this.logout();
            }
            console.log(response);
            if (response.data === 'cannot like a tweet twice') {
                toast.error('cannot like a tweet twice', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
            }

            else {

                this.componentDidMount()
            }
        }
        );
    }


    renderListItem(data) {
        console.log("data inside render", data.tweetDetails.tweetID);
        return (

            <div className="p-col-12">
                <ToastContainer autoClose={3000} />
                <div className="tweet-list-item backgroundColor">
                    <img src={logo} alt="Logo" />
                    <div className="tweet-list-detail">
                        <div className="tweet-description">{data.tweetDetails.tweetData}</div>
                        <div className="tweet-name">Tweeted by: @{data.tweetDetails.user.emailId}</div>
                        <div style={{marginBottom: "10px"}}>At: {data.tweetDetails.tweetTime}</div>
                        
                        
                        <Button icon="pi pi-comment" label='Comment' onClick={() => this.getReplyTweet(data.tweetDetails.tweetID, data.replies)} ></Button>&nbsp; &nbsp;&nbsp;
                        <Button icon="pi pi-heart" label='Likes' onClick={() => this.saveLike(data.tweetDetails.tweetID)} ></Button>&nbsp; &nbsp;{data.likes}
                    </div>

                </div>
            </div>
        );
    }
    renderFooter() {
        return (
            <div>
                <Button label="Cancel" onClick={() => this.onHide()} className="p-button-text" />
                <Button label="Reply" onClick={() => this.saveReplyTweet()} autoFocus />
            </div>
        );
    }
    onHide() {
        this.setState({ showReplyTweet: false });
        this.componentDidMount();
    }
    handleReplyChange = (e) => {

        let reply = this.state.reply;
        reply["tweetData"] = e.target.value;
        console.log("reply", reply)
        this.setState({ reply })
    }


    itemTemplate(tweet, layout) {
        console.log("tweet data", tweet);
        if (!tweet) {
            return;
        }

        if (layout === 'list')
            return this.renderListItem(tweet);

    }

    renderHeader() {
        return (
            <div className="center heading"><h4>Tweet</h4></div>
        );
    }

    render() {
        const header = this.renderHeader();

        return (
            <div>
                <div className="dataview-demo">
                    <div className="card">
                        <DataView value={this.state.tweets} layout={this.state.layout} header={header}
                            itemTemplate={this.itemTemplate} paginator rows={6} />


                    </div>
                </div>

                <Dialog header="Reply Tweet" footer={this.renderFooter()} visible={this.state.showReplyTweet} style={{ width: '40vw' }}>

                    <br /><span>{this.state.message}</span><br />
                    {/* {console.log(this.state.replyTweets, "eRERERER")}
{console.log(this.state.replyTweets[0], "comm")} */}

                    {
                        <table className="table table-striped">
                            <tr key={"header"}>
                                {/* {Object.keys(this.state.replyTweets).map((key) => (
          <th>{key}</th>
        ))} */}
                                <th>
                                    Comment
                                </th>
                                <th>
                                    Replied by
                                </th>
                                <th>
                                    Date
                                </th>
                                
                            </tr>
                            {this.state.replyTweets.map((item) => (
                                <tr key={item.id} id={item.tweetId}>
                                    <td>
                                        {item.comment}
                                    </td>
                                    <td>
                                        {item.username}
                                    </td>
                                    <td>
                                        {
                                            item.dateTime
                                        }
                                    </td>

                                    {/* <p hidden id='hiddenTweetID'>{item.tweetId}</p> */}

                                    {/* {Object.values(item).map((val) => (

                     item != "tweetId" || item != "id"
                    ?(
                    <td>{val}</td>):({})
            
          ))} */}
                                </tr>
                            ))}
                        </table>
                    }
                    <br /><span className="error"> {this.state.error}</span>
                    <br /><input placeholder="Enter Post" name="post" className="form-control"
                        value={this.state.reply["tweetData"]} onChange={this.handleReplyChange} />

                </Dialog>

            </div>
        );
    }
}

export default ViewTweetComponent