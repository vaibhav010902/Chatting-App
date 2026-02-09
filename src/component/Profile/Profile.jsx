import React, { useState, useEffect, useRef } from "react";
import Input from "../Input/Input";
import { set, useForm } from "react-hook-form";
import profileServices from "../../appwrite/profileServices";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import "./Profile.css";
import Navbar from "../Navbar/Navbar";
import storageServices from "../../appwrite/storage";
import { ID } from "appwrite";
import settingServices from "../../appwrite/settingServices";

function Profile() {
  console.log("Inside Profile Component....");

  const [error, setError] = useState("");
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(true);
  const profileImageRef = useRef(null)
  const [image, setImage] = useState("")
  const [localFileImage, setLocalFileImage] = useState("")

  const handleClick = () => {
    profileImageRef.current.click()
  }
  const previewImage = () => {
    if(profileImageRef.current.files.length == 0) return;
    // if(urlImage){
    //   setImage(URL.createObjectURL(urlImage))
    //   return;
    // }
    setImage(URL.createObjectURL(profileImageRef.current.files[0]))
  }
  const uploadLocalFileImage = () => {
    if(profileImageRef.current.files.length == 0) return;
    console.log(URL.createObjectURL(profileImageRef.current.files[0]))
    setLocalFileImage(URL.createObjectURL(profileImageRef.current.files[0]))
  }
  const removeLocalFileImage = () => {
    setLocalFileImage("")
    setImage("")
    URL.revokeObjectURL(localFileImage)
  }

  const parts = userData?.name.trim().split(" ");
  const firstName = parts[0];
  const lastName = parts?.slice(1).join(" ");
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      first_name: firstName,
      last_name: lastName,
      email: userData.email,
    },
  });

  const setProfile = async (data) => {
    setError("");
    if(localFileImage){
      const fileID = ID.unique();
      const file = profileImageRef.current.files[0]
      let cvtImage = await storageServices.uploadFile({fileID,file})
      cvtImage = cvtImage.replace("preview","view")+"&mode=admin"
      setLocalFileImage(cvtImage)
    }

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
        profile_image: localFileImage ? localFileImage : data.profile_image,
      });
      localFileImage && URL.revokeObjectURL(localFileImage);
      // console.log("After Callling setProfile function of profileServices.js")
      if (session) {
        console.log("Profile set successfully");
        await settingServices.createSettings(userData.$id);
        navigate("/");
      } else {
        setError("Something went wrong!!! Please try again later");
      }
    } catch (error) {
      setError(error.message);
      if(error.message == `Invalid document structure: Attribute "profile_image" has invalid format. Value must be a valid URL`){
        setError("Profile Image value must be a valid URL")
      }
    }
  };

  useEffect(() => {
    if (userData) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [userData]);
  // if (loading) return <div>Loading...</div>;
  // if (!userData.length) return <div>Loading....</div>;
  return loading ? (
    <Loading />
  ) : (
    <>
      <Navbar />
      <div className="profile-setup-page">
        <div className="profile-setup-container">
          <div className="page-setup-image-preview-container">
            {!image ? (<span className="profile-image-icon" onClick={handleClick}>
              <p>Click here to select <br/>Profile Image</p>
            </span>) : (<img
              // src="https://fra.cloud.appwrite.io/v1/storage/buckets/69765f44003cd4e19451/files/697d32ae000adb8f0e7e/view?project=6967f521002a896162cb&mode=admin"
              src={image ? image : ""} 
              alt=""
              onClick={handleClick}
            />)}
            <input type="file" hidden ref={profileImageRef} onChange={previewImage}/>
            <button onClick={uploadLocalFileImage}>Upload</button>
            {localFileImage && <button onClick={removeLocalFileImage}>Remove</button>}
          </div>
          <div className="page-setup-page-field-container">
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
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  width: "100%",
                  paddingLeft: "10px",
                  marginBottom: "20px",
                }}
              >
                Profile Setup
              </p>
              {error && <p 
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "red",
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "10px"
                }}  
              >{error}</p>}
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
              {!localFileImage ? 
              (<Input
                label="Profile image"
                type="url"
                placeholder="Paste URL if you have, otherwise select image from left side"
                {...register("profile_image", {
                  required: false,
                })}
              />):
              (<Input
                label="Profile image"
                type="url"
                placeholder="Paste URL if you have, otherwise select image from left side"
                disabled
                {...register("profile_image", {
                  required: false,
                })}
              />)}
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
