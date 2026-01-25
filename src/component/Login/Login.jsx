import React, { useState } from 'react'
import styles from './Login.module.css'
import { Input, Button } from './../index'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import authServices from '../../appwrite/auth'
import {login as authLogin} from '../../store/authSlice'

function Login() {
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async (data) => {
    setError("");
    // console.log("login function")
    try {
      const session = await authServices.loginAccount(data);
      if (session) {
        const userData = await authServices.getCurrentUser();
        if(userData){
          dispatch(authLogin({userData}));
          navigate("/");
        }else{
          setError(error.message || "Login failed");
        }
      }
    } catch (error) {
      setError(error.message || "Login failed");
    }
  }

  return (
    <>
      <form
        className={styles.login_container}
        onSubmit={handleSubmit(login)}
      >
        <div className={styles.login_header}>
          <h1>Login</h1>
        </div>
        {error && (
          <div style={{ color: "red", padding: "5px 10px", fontSize: "12px" }}>
            {error}
          </div>
        )}
        <div className={styles.fields_container}>
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            {...register("email", {
              required: true,
              validate: {
                matchPatern: (value) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) || "Invalid email address"
              }
            })}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            type="password"
            {...register("password", {
              required: true
            })}
          />
        </div>
        <div className={styles.btn_container}>
          <Button text="Login" type="submit" />
          <Button text="Login with Google" />
        </div>
        <div className={styles.links_container}>
          <p>
            Don&apos; t have any account?&nbsp;
            <Link to="/signup">Sign up</Link>  
          </p>
        </div>
      </form>
    </>
  )
}

export default Login