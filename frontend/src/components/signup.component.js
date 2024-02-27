import React from 'react'
import { useState } from 'react';

export default function SignUp() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const handleSubmit = (e) => {

    if (userType === "Admin" && secretKey !== "Admin@123") {
      e.preventDefault();

      alert('Invalid Secret Key!, You are not a Admin register as a user!')
    } else {
      e.preventDefault();
      console.log(firstName, lastName, email, password);

      fetch("http://localhost:5000/register", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        }, 
        body:JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          userType,
        }),
      }).then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
      });
    }
  }


  return (
    <form onSubmit={handleSubmit}>
      <h3>Sign Up</h3>

      <div>
        <label> Register As: </label>
        <input 
          type="radio" 
          name="UserType" 
          value="User" 
          onChange={(e) => setUserType(e.target.value)}
        /> {" "}
        User
        
        <input 
          type="radio" 
          name="UserType" 
          value="Admin" 
          onChange={(e) => setUserType(e.target.value)}
        /> {" "}
        Admin
      </div>

      {userType === "Admin" ? 
        <div className="mb-3">
          <label>Secret Key</label>
          <input
            type="text"
            className="form-control"
            placeholder="Secret Key"
            onChange={(e) => setSecretKey(e.target.value)}
          />
        </div> : null
      }
            
      <div className="mb-3">
        <label>First name</label>
        <input
          type="text"
          className="form-control"
          placeholder="First name"
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Last name</label>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Last name" 
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </div>
      <p className="forgot-password text-right">
        Already registered <a href="/sign-in">sign in?</a>
      </p>
    </form>
  )
}
