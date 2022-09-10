import axios from 'axios';
const baseUrl = 'http://localhost:5001/api/v1.0/tweets';

class UserService {

	getToken() {
		var tok = localStorage.getItem("token");
		var min = 40;
		var now = new Date().getTime();
		var setupTime = localStorage.getItem('setupTime');
		if (now - setupTime > min * 60 * 1000) {
			localStorage.clear();
		}
		if (tok === "") {
			return false;
		}
		return tok;
	}

	async saveUser(user) {
		var res = await axios({
			method: "POST",
			url: baseUrl + '/register', user,
			data: user,
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			}
		});

		//return axios.post(baseUrl+'/register',user);
		return res;
	}

	getLogin(loginId, password) {

		var basicAuth = 'Basic ' + window.btoa(loginId + ':' + password);
		var auth = {
			emailId: loginId,
			password: password
		}
		console.log(auth);
		// return axios.get(baseUrl+'/login',{headers: { 'Authorization': basicAuth }});

		return axios.post(baseUrl + '/login', {
			emailId: loginId,
			password: password
		})
	}

	async getUser() {
		let token = this.getToken();
		if(!token){
			return "TokenNotValid";
		}
		
		var res = await axios({
			method: "GET",
			url: baseUrl + '/users/all',
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": `Bearer ${token}`
			}
		});
		
		// return axios.get(baseUrl + '/users/all');
		return res;
	}

	async getUserSearch(username) {
		let usersearch = encodeURIComponent(username);
		
		let token = this.getToken();
		if(!token){
			return "TokenNotValid";
		}
		
		var res = await axios({
			method: "GET",
			url: baseUrl + '/user/search/' + usersearch,
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": `Bearer ${token}`
			}
		});

		// return axios.get(baseUrl + '/user/search/' + usersearch);
		return res;
	}

	async forgetPassword(username, newPassword) {
		let loginId = localStorage.getItem('loginId');
		let token = this.getToken();
		if(!token){
			return "TokenNotValid";
		}
		
		var res = await axios({
			method: "PUT",
			url: baseUrl + '/' + username + '/forgetPassword/' + newPassword,
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": `Bearer ${token}`
			}
		});

		// return axios.put(baseUrl + '/' + username + '/forgetPassword/' + newPassword);

		return res;
	}

}
export default new UserService()