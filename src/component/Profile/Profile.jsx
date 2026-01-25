import React, { useState,useEffect } from "react";
import Input from "../Input/Input";
import { set, useForm } from "react-hook-form";
import profileServices from "../../appwrite/profileServices";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";

function Profile() {
  console.log("Inside Profile Component....")

  const [ error, setError ] = useState("");
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(true);

  // console.log("Profile userData: ",userData)
  const parts = userData?.name.trim().split(" ");
  const firstName = parts[0];
  const lastName = parts?.slice(1).join(" ");
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      first_name: firstName,
      last_name: lastName,
      email: userData.email,
    }
  });


  const setProfile = async (data) => {
    setError("");
    // console.log("Inside setProfile");
    try {
      // console.log("Trying to set profile")
      const session = await profileServices.setProfile({
        userId: userData.$id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
        status: data.status,
        profile_image: data.profile_image,
      });
      // console.log("After Callling setProfile function of profileServices.js")
      if (session) {
        console.log("Profile set successfully");
        navigate("/");
      } else {
        setError("Something went wrong!!! Please try again later");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if(userData){
      setLoading(false);
    }else{
      setLoading(true);
    }
  },[userData])
  // if (loading) return <div>Loading...</div>;
  // if (!userData.length) return <div>Loading....</div>;  
  return (
    loading?<Loading/>:
    <form
      onSubmit={handleSubmit(setProfile)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "500px",
        padding: "15px",
        border: "1px solid black",
        borderRadius: "7px",
      }}
    >
      <Input
        label="First Name"
        type="text"
        {...register("first_name", {
          required: true,
        })}
      />
      <Input
        label="Last Name"
        type="text"
        {...register("last_name", {
          required: true,
        })}
      />
      <Input
        label="Email"
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
        label="Phone Number"
        type="number"
        {...register("phone", {
          required: true,
          minLength: 10,
          maxLength: 10,
        })}
      />
      <Input
        label="Date of birth"
        type="date"
        {...register("dob", {
          required: true,
        })}
      />
      <Input
        label="status"
        type="text"
        {...register("status", {
          required: false,
        })}
      />
      <Input
        label="Profile image"
        type="url"
        {...register("profile_image", {
          required: false,
        })}
      />
      <button type="submit">Save</button>
    </form>
  );
}

export default Profile;
