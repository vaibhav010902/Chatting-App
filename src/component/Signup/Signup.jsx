import React, { useState } from "react";
import styles from "./Signup.module.css";
import { Input, Button, Navbar, Loading } from "./../index";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import authServices from "./../../appwrite/auth";
import { login as loginAuth} from "../../store/authSlice";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const signup = async (data) => {
    // console.log("Inside signup", data.target[2].value, register)
    setError("");
    try {
      const session = await authServices.createAccount(data);
      if (session) {
        const userData = await authServices.getCurrentUser();
        if (userData) {
          console.log("Sign up userData: ", userData);
          dispatch(loginAuth({userData}));
          // TO-DO: BEFORE NAVIGATION CHECK IF THE USER AUTH STATUS UPDATED TO TRUE OR NOT .
          navigate("/profile");
        }
      } else {
        console.log("Failed to Signup");
        setError("Signup Failed");
      }
    } catch (error) {
      console.log("error", error);
      setError(error.message || "Signup failed");
    }
  };
  // const signup = async (data) => {
  //   // console.log("Inside signup", data.target[2].value, register)
  //   setError("");
  //   try {
  //     const session = await authServices.createAccount({
  //       email: data.target[2].value,
  //       password: data.target[3].value,
  //       first_name: data.target[0].value,
  //       last_name: data.target[1].value
  //     });
  //     if (session) {
  //       const userData = await authServices.getCurrentUser()
  //       if(userData){
  //         // dispatch(login(userData))
  //         console.log(userData)
  //       }
  //     } else {
  //       console.log("Failed to Signup")
  //       setError("Signup Failed")
  //     }
  //   } catch (error) {
  //     console.log("error", error)
  //     setError(error.message || "Signup failed")
  //   }
  // }

  return (
    <>
      <div className={styles.signup_container}>
        <div className={styles.signup_header}>
          <h1>Sign up</h1>
        </div>
        {error && (
          <div style={{ color: "red", padding: "10px", fontSize: "12px" }}>
            {error}
          </div>
        )}
        <form
          className={styles.fields_container}
          onSubmit={handleSubmit(signup)}
        >
          <div className={styles.namefield_container}>
            <Input
              label="First Name"
              placeholder="Enter First Name"
              type="text"
              {...register("first_name", {
                required: true,
              })}
            />
            <Input
              label="Last Name"
              placeholder="Enter Last Name"
              type="text"
              {...register("last_name", {
                required: true,
              })}
            />
          </div>
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            {...register("email", {
              required: true,
              validate: {
                matchPatern: (value) =>
                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ||
                  "Invalid email address",
              },
            })}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            type="password"
            {...register("password", {
              required: true,
            })}
          />
          <div className={styles.btn_container}>
            {/* <Button text="Signup" type="submit"/> */}
            <button type="submit" onClick={() => console.log("Clicked")}>
              Sign up
            </button>
          </div>
        </form>
        <div className={styles.links_container}>
          <p>
            Don&apos; t have any account?&nbsp;
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
