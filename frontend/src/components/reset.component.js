import React, { Component } from 'react';

export default class Reset extends Component {

    constructor(props) {
        super(props);
        this.state = {
        email: "",
        showPopup: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (e) => {

        e.preventDefault();
        const { email } = this.state;

        if (email === "") {
            
            alert('Enter email address')
            return false
        } 

        fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        crossDomain: true,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
        }, 
        body: JSON.stringify({
            email,
        }),
        }).then((res) => res.json())
        .then((data) => {
        console.log(data, "Reset Password");

            if (data.status === "User Not Found!") {
                alert('User Not Found!');
            } else {
                // Display the popup and reset email input
                this.setState({ showPopup: true, email: "" }, () => {
                    // You can optionally add a console log to check if showPopup is updated
                    console.log("Popup shown:", this.state.showPopup);
                });
            }
        }).catch((error) => {
            console.error("Error during fetch:", error);
            // Handle error, e.g., display an error message to the user
        });
    
    }

  closePopup = () => {
    // Close the popup and redirect to sign-in page
    this.setState({ showPopup: false });
    // Replace '/sign-in' with the actual route to your sign-in page
    window.location.href = '/sign-in';
  }

  render() {
    const { showPopup } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Forgot Password</h3>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={e => this.setState({ email: e.target.value })}
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
        <p className="forgot-password text-right">
          Don't have an account <a href="/sign-up">signup</a>
        </p>

        {/* Popup message */}
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <p>Email has been sent to you!</p>
              <button onClick={this.closePopup} className="btn btn-primary">Okay</button>
            </div>
          </div>
        )}
      </form>
    );
  }
}
