import React, { Component } from "react";
import HeaderComponent from "./HeaderComponent";
import "./Style.css";
import UserService from "../services/UserService";
import { useHistory } from "react-router-dom";

class Registration extends React.Component {
  constructor(props) {
    super(props);
    // const [gender,setGender] = useState({GeId:0,productName:'',productCategory:'',productPrice:0});
    this.state = {
      users: {},
      error: "",
      message: "",
      showError: false,
    };

  }

  handleChange(user, e) {
    let users = this.state.users;
    users[user] = e.target.value;
    this.setState({ users });
    this.setState({ showError: false });
    //console.log(users[user]);
  }

  handelValidation() {
    let users = this.state.users;
    let validate = true;
    console.log("Registration user", users);
    console.log(users.email);
    if (
      !users["firstName"] &&
      !users["lastName"] &&
      !users["emailId"] &&
      !users["dob"] &&
      users["gender"] != 'none' &&
      !users["password"] &&
      !users["profileString"]
    ) 
    {
      this.setState({ error: "Please enter all field" });
      this.setState({ showError: true });
      validate = false;
    } 
    else {
      if (users["password"] != users["confirmPassword"]) {
        this.setState({
          error: "Please enter password and confirmPassword same",
        });
        validate = false;
      } else {
        validate = true;
      }
    }
    return validate;
  }

  cancel = (e) => {
    e.preventDefault();
    this.props.history.push("/registration");
  };

  goToHome = (e) => {
    console.log("redirecting to home");
    localStorage.setItem("loginId", this.state.users["emailId"])
    this.props.history.push('/');
  }


  login = (e) => {
    console.log("login")
    e.preventDefault();
    this.props.history.push("/");
  };
  saveUserDetails = (e) => {
    e.preventDefault();
    if (this.handelValidation()) {
      let users = this.state.users;
      UserService.saveUser(users)
        .then((response) => {
          this.setState({ message: "Registered successfully" });
          this.goToHome();
        })
        .catch((err) => {
          let error = err.message;
          if (error == "Request failed with status code 500") {
            this.setState({ error: "Login Id and Email Already Exist" });
          }
        });
    }
  };

  render() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0 so need to add 1 to make it 1!
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd
    }

    if (mm < 10) {
      mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    var minDate = "1900-01-01"
    return (
      <div>
        <HeaderComponent />
        <div>
          <div className="registration">
            <h2 className="centerregist">Registration</h2>
            <form>
              <div className="form-group">
                <input
                  placeholder="First Name"
                  name="firstName"
                  className="form-control"
                  value={this.state.users["firstName"]}
                  onChange={this.handleChange.bind(this, "firstName")}
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Last Name"
                  name="lastName"
                  className="form-control"
                  value={this.state.users["lastName"]}
                  onChange={this.handleChange.bind(this, "lastName")}
                />
              </div>
              <div className="form-group">
                <input
                  type="date"
                  placeholder="Date of Birth"
                  name="dob"
                  className="form-control"
                  value={this.state.users["dob"]}
                  onChange={this.handleChange.bind(this, "dob")}
                  max={today}
                  min={minDate}
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Email Id(login ID)"
                  name="email"
                  className="form-control"
                  value={this.state.users["emailId"]}
                  onChange={this.handleChange.bind(this, "emailId")}
                />
              </div>
              <div className="form-group">
                <label  htmlFor=""><b>Gender</b></label>
                <select className="form-control" ref={this.state.users["gender"]} onChange={this.handleChange.bind(this, "gender")}>
                  <option value="none">Select One</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Other</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  className="form-control"
                  value={this.state.users["password"]}
                  onChange={this.handleChange.bind(this, "password")}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  className="form-control"
                  value={this.state.users["confirmPassword"]}
                  onChange={this.handleChange.bind(this, "confirmPassword")}
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Avatar URL"
                  name="profileString"
                  className="form-control"
                  value={this.state.users["profileString"]}
                  onChange={this.handleChange.bind(this, "profileString")}
                />
              </div>
              <div className="form-group">
                {this.state.showError = true ? (
                  <p>
                    <span className="error">{this.state.error}</span>
                    <span className="message">{this.state.message}</span>
                  </p>
                ) : (<p></p>)
                }
              </div>
              <button
                className="btn btn-success"
                onClick={this.saveUserDetails.bind(this)}
              >
                Save
              </button>
              <button
                className="btn btn-danger"
                onClick={this.cancel.bind()}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
              <span>
                {" "}
                <a href="" onClick={this.login.bind()}><span style={{color: "black"}}><b>Already registered?LOGIN</b></span>
                </a>
              </span>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Registration;
