import {
    Form,
    redirect,
    useActionData,
    useNavigate
} from "react-router-dom";
import './login.css'
import { useState, useEffect } from "react";

export function LoginPage() {
  
    return (
    <>
      <div className="form-div">
        <h1>D_Arena</h1>
        <Form method="post">
          <br />
          <input 
              type="text" 
              name="username" 
              placeholder="Enter a username" 
              required 
          />
          <button className="btn-trans" type="submit">Play</button>
        </Form>
        <br />
        <br />
      </div>
    </>)
}