import React, { Component } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import PostService from '../services/PostService';
import logo from '../image/download.png';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Rating } from 'primereact/rating';
import './TweetStyle.css';
import { Dialog } from 'primereact/dialog';

class ViewMyTweetComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tweets: [],
            showReplyTweet: false,
            showUpdateTweet: false,
            replyTweets: [],
            reply: {},
            message: '',
            error: '',
            layout: 'list',
            tweetId: '',
            updateTweet: '',
            updateTweetId: '',
            tweetUpdated: false

        };
        this.itemTemplate = this.itemTemplate.bind(this);

    }
    
    getReplyTweet(tweetId, tweetMessage) {
        PostService.getReplyTweet(tweetId).then(response => {
            if (response === "TokenNotValid") {
                this.logout();
            }
            this.setState({ replyTweets: response.data })
        });
        this.setState({ showReplyTweet: true });
        this.setState({ reply: {} });
        this.setState({ message: tweetMessage });
        this.setState({ tweetId: tweetId });
        this.setState({ error: '' });

    }

    saveReplyTweet() {
        let reply = this.state.reply;
        this.setState({ error: '' });
        if (reply["replyMessage"].length <= 144) {
            reply["tweetMessageId"] = this.state.tweetId;
            reply["loginId"] = localStorage.getItem('loginId');
            console.log(reply["replyMessage"]);
            PostService.saveReplyTweet(reply).then(response => {
                if (response === "TokenNotValid") {
                    this.logout();
                }
                PostService.getReplyTweet(this.state.tweetId).then(response => 
                {
                    if (response === "TokenNotValid") {
                        this.logout();
                    }
                    this.setState({ replyTweets: response.data })

                });
            });
        }
        else {
            this.setState({ error: 'Message size is long' });
        }
    }

    handleUpdateTweetChange = (e) => {
        e.preventDefault();
        this.setState({ updateTweet: e.target.value });

    }

    displayUpdateTweet(id, tweet) {
        this.setState({ showUpdateTweet: true });
        this.setState({ updateTweet: tweet });
        this.setState({ updateTweetId: id });
    }

    saveUpdateTweet() {

        var updateTweetData = {
            tweetID: this.state.updateTweetId,
            tweetData: this.state.updateTweet
        }

        console.log(localStorage.getItem('loginId'))
        console.log("update data", updateTweetData);

        PostService.updateTweet(updateTweetData, this.state.updateTweetId).then(response => {
            if (response === "TokenNotValid") {
                this.logout();
            }
            this.setState({ showUpdateTweet: false });
            toast.success('successful', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
            this.componentDidMount();
        })
    }

    componentDidMount() {
        console.log("componnet mount or not")
        PostService.getUserTweet().then(response => {
            if (response === "TokenNotValid") {
                this.logout();
            }
            this.setState({ tweets: response.data }, () => {
                console.log(this.state.tweets)
            })
        });
    }
    
    logout = () => {
        localStorage.clear();
        console.log("props logout", this.props);
        // this.props.history.goBack();
        toast.warn("Session TimmeOut!!! Please Login Again.", { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
        setTimeout(3000);
        window.location.href = '/';
    }
    
    saveLike(username, id) {
        PostService.saveLike(username, id).then(response => { 
            if (response === "TokenNotValid") {
                this.logout();
            }
            this.componentDidMount();
        });
    }
    
    deleteTweet(id) {
        PostService.deleteTweet(id).then(response => { 
            if (response === "TokenNotValid") {
                this.logout();
            }
            this.componentDidMount();
        });
    }


    renderListItem(data) {
        console.log("some data", data)
        return (
            <div className="p-col-12">

                <div className="tweet-list-item backgroundColor">
                    <ToastContainer autoClose={3000} />
                    <img src={logo} alt="Logo" />
                    <div className="tweet-list-detail">
                        <div className="tweet-description">{data.TweetData}</div>
                        <div className="tweet-name">Tweeted by: {data.User.EmailId}</div>
                        <div style={{marginBottom: "10px"}}>At: {data.TweetTime}</div>
                        
                        {/* <Button icon="pi pi-comment" title="Reply Tweet" onClick={() => this.getReplyTweet(data.TweetID, data.tweetData)} ></Button>&nbsp; &nbsp;&nbsp;
                        <Button icon="pi pi-heart" title="Like Tweet" onClick={() => this.saveLike(data.loginId, data.TweetID)} ></Button>&nbsp; &nbsp;{data.likeCount}&nbsp; &nbsp;&nbsp; */}
                        <Button icon="pi pi-pencil" label='Update'  title="Update Tweet" onClick={() => this.displayUpdateTweet(data.TweetID, data.tweetData)} ></Button>&nbsp; &nbsp;&nbsp;
                        <Button icon="pi pi-trash" label='Delete' title="Delete Tweet" onClick={() => this.deleteTweet(data.TweetID)} ></Button>
                    </div>

                </div>
            </div>
        );
    }
    
    renderFooter(option) {
        if (option == "reply") {
            return (
                <div>
                    <Button label="Cancel" onClick={() => this.onHide("reply")} className="p-button-text" />
                    <Button label="Reply" onClick={() => this.saveReplyTweet()} autoFocus />
                </div>
            );
        }
        else {
            return (
                <div>
                    <Button label="Cancel" onClick={() => this.onHide("update")} className="p-button-text" />
                    <Button label="Update" onClick={() => this.saveUpdateTweet()} autoFocus />
                </div>
            );

        }
    }
    
    onHide(option) {
        if (option == "reply") {
            this.setState({ showReplyTweet: false });
        }
        else {
            this.setState({ showUpdateTweet: false });
        }
    }
    
    handleReplyChange = (e) => {
        let reply = this.state.reply;
        reply["replyMessage"] = e.target.value;
        this.setState({ reply })
    }

    itemTemplate(tweet, layout) {
        if (!tweet) {
            return;
        }
        if (layout === 'list')
            return this.renderListItem(tweet);
    }

    renderHeader() {
        return (
            <div className="center heading"><h4>All my Tweets</h4></div>
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

                <Dialog header="Reply Tweet" footer={this.renderFooter("reply")} visible={this.state.showReplyTweet} style={{ width: '40vw' }}>

                    <br /><span>{this.state.message}</span><br />
                    <table className="table table-striped ">
                        {
                            this.state.replyTweets.map(
                                reply =>
                                    <tr key={reply.id}>
                                        <td>  {reply.loginId} </td>
                                        <td> {reply.replyMessage}</td>

                                    </tr>)}
                    </table>

                    <br /><span className="error"> {this.state.error}</span>
                    <br /><input placeholder="Enter Post" name="post" className="form-control"
                        value={this.state.reply["replyMessage"]} onChange={this.handleReplyChange} />

                </Dialog>

                <Dialog header="Update Tweet" footer={this.renderFooter("update")} visible={this.state.showUpdateTweet} style={{ width: '50vw' }}>
                    <br /><input placeholder="Enter Post" name="post" className="form-control"
                        value={this.state.updateTweet} onChange={this.handleUpdateTweetChange} />

                </Dialog>

            </div>
        );
    }
}

export default ViewMyTweetComponent