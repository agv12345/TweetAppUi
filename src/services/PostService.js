import axios from "axios";
const baseUrl = "http://localhost:5001/api/v1.0/tweets";
// const token = localStorage.getItem("token");
//const loginId=localStorage.getItem('loginId');

class PostService {

	getToken(){
		var tok = localStorage.getItem("token");
		var min = 40;
		var now = new Date().getTime();
		var setupTime = localStorage.getItem('setupTime');
		if(now-setupTime > min*60*1000) {
			localStorage.clear();
		}
		if(tok === ""){
			return false;
		}

		return tok;
	}

	async postTweet(tweet) {
		let loginId = localStorage.getItem("loginId");
		let token = this.getToken();
		if(!token){
			return "TokenNotValid";
		}
		var res = await axios({
			method: "POST",
			url: baseUrl + "/" + loginId + "/add",
			data: tweet,
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": `Bearer ${token}`
			}
		});

		// return axios.post(baseUrl + "/" + loginId + "/add", tweet);
		return res;
	}

	async saveLike(login, id) {
		let username = encodeURIComponent(login);
		let token = this.getToken();
		if(!token){
			return "TokenNotValid";
		}

		const res = await axios({
			method: "PUT",
			url: baseUrl + "/" + username + "/like/" + id,
			headers: { 
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": `Bearer ${token}`
			}
		});
		console.log("Promise", res);

		return res;
		//axios.put(baseUrl+'/'+username+'/like/'+id);
	}

	async getAllTweet() {
		let token = this.getToken();
		if(!token){
			return "TokenNotValid";
		}
		console.log("token", token);
		var res = await axios({
			method: "GET",
			url: baseUrl + "/all",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": `Bearer ${token}`,
			},
		});

		console.log("all tweets", res);
		
		return res;
	}

	async getReplyTweet(tweetMessageId) {
		let token = this.getToken();
		if(!token){
			return "TokenNotValid";
		}

		var res = await axios({
			method: "GET",
			url: baseUrl + "/replyTweet/" + tweetMessageId,
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": `Bearer ${token}`
			}
		});

		return res;
	}

	async saveReplyTweet(reply, tweetID) {
		console.log("reply again", reply);
		let loginId = localStorage.getItem("loginId");
		let login = encodeURIComponent(loginId);
		let token = this.getToken();
		if(!token){
			return "TokenNotValid";
		}
		
		var res = await axios({
			method: "POST",
			url: baseUrl + "/" + login + "/reply/" + tweetID,
			data: reply,
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": `Bearer ${token}`
			}
		});
		//return axios.post(baseUrl + "/" + login + "/reply/" + tweetID, reply);
		return res;
	}

	async getUserTweet() {
		let loginId = localStorage.getItem("loginId");
		let token = this.getToken();
		if(!token){
			return "TokenNotValid";
		}

		var res = await axios({
			method: "GET",
			url: baseUrl + "/" + loginId,
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": `Bearer ${token}`
			}
		});
		return res;
	}

	async updateTweet(tweet, id) {
		let loginId = localStorage.getItem("loginId");
		let login = encodeURIComponent(loginId);
		let token = this.getToken();
		if(!token){
			return "TokenNotValid";
		}

		console.log("tweet", tweet);
		const res = await axios({
			method: "PUT",
			url: baseUrl + "/" + login + "/update/" + id,
			data: tweet,
			headers: { 
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": `Bearer ${token}`
			},
		});
		console.log("Promise", res);
		return res;
	}

	async resetPassword(oldPassword, newPassword) {
		let loginId = localStorage.getItem("loginId");
		let token = this.getToken();
		if(!token){
			return "TokenNotValid";
		}

		const res = await axios({
			method: "PUT",
			url: baseUrl + "/" + loginId + "/resetPassword/" + oldPassword + "/" + newPassword,
			headers: { 
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": `Bearer ${token}`
			},
		});

		// return axios.put(
		// 	baseUrl +
		// 	"/" +
		// 	loginId +
		// 	"/resetPassword/" +
		// 	oldPassword +
		// 	"/" +
		// 	newPassword
		// );
		return res;
	}
	
	async deleteTweet(id) {
		let loginId = localStorage.getItem("loginId");
		let token = this.getToken();
		if(!token){
			return "TokenNotValid";
		}

		const res = await axios({
			method: "DELETE",
			url: baseUrl + "/" + loginId + "/delete/" + id,
			headers: { 
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": `Bearer ${token}`
			},
		});

		//return axios.delete(baseUrl + "/" + loginId + "/delete/" + id);
		return res;
	}
}
export default new PostService();
