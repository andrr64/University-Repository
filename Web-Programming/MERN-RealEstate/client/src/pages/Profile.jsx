/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import {app} from '../firebase.js';
import { 
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure,
  loadingStart,
  loadingFinished,
  deleteUserFailed,
  deleteUserStart,
  deleteUserSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess
} from "../redux/user/userSlice.js";
import {Link} from 'react-router-dom';

const Profile = () => {
  const fileRef = useRef(null);
  const submitButtonRef = useRef(null);
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file){
      handleFileUpload(file);
    }
  }, [file]);
  const setUpdateStatusMsg = async(bool, msg) => {
    setUpdateStatus({
      success: bool,
      message: msg,
    });
    setTimeout(() => {
      setUpdateStatus(undefined);
    }, 3000);
  }
  const handleFileUpload = (file) => {
    dispatch(loadingStart());
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    const setPercToZeroAfterXSeconds = async() => {
      setTimeout(() => {
        setFilePerc(0);
      }, 3000);
    }
    uploadTask.on('state_changed', 
      (snapshot) => {
        setFilePerc(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
      },
      (error) => {
        setFileUploadError(true);
        dispatch(loadingFinished());
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (url) => {
            setFormData({...formData, avatar: url});
            dispatch(loadingFinished());
            setPercToZeroAfterXSeconds();
          }
        );
      }
    );
  
    // Mulai proses pengunggahan
    uploadTask.resume();
  }
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }
  const handleUpdate = async (e) => {
    e.preventDefault(); 
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const responseJson = await res.json();
      if (responseJson.success === false){
        dispatch(updateUserFailure(responseJson.message));
        setUpdateStatusMsg(false, 'you can only update your own account'); 
        return;
      }
      dispatch(updateUserSuccess(responseJson));
      setUpdateStatusMsg(true, 'Updated successfully')
    } catch (error) {
      dispatch(updateUserFailure(error.message))
      setUpdateStatusMsg(false, error.message); 
    }
  }
  const handleSignout = async(e) =>{
    try {
      dispatch(signOutStart());
      const res = await fetch('/api/auth/signout');
      const resJson = await res.json();
      if (resJson.success === false){
        dispatch(signOutFailure(resJson.message));
        return;
      }
      dispatch(signOutSuccess());
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }

  }
  const handleDelete = async (e) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const responseJson = await res.json();
      if (responseJson.success === false){
        setUpdateStatusMsg(false, responseJson.message);
        dispatch(deleteUserFailed(responseJson.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailed(error.message));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input 
          type="file" 
          hidden
          accept="image/*"
          ref={fileRef}
          onChange={(event) => setFile(event.target.files[0])} 
        />
        <img
          onClick={() => fileRef.current.click()}
          src={currentUser.avatar} 
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"/>
        <input 
          onChange={handleChange}
          id="username"
          type="text" 
          placeholder="Username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"/>
        <input
          onChange={handleChange}
          id="email"
          type="email" 
          placeholder="Email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"/>
        <input 
          onChange={handleChange}
          id="password"
          type="password" 
          placeholder="New Password"
          className="border p-3 rounded-lg"/> 
        <p 
          className="font-bold">
          {fileUploadError? 
            <span className="text-red-700">Error Image Upload</span>
            : 
            filePerc > 0 && filePerc < 100?
            <span className="text-slate-700">Uploading file {filePerc}%</span>
            : 
            filePerc === 100? 
              <span className="text-green-700">File uploaded successfully</span> 
              : 
              ''
          }
        </p>
        <button 
          ref={submitButtonRef}
          disabled={loading}
          onClick={handleUpdate}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading? 'Updating...' : 'Update'}
        </button>
        <Link
          className='hover:opacity-95 bg-green-700 text-white p-3 rounded-lg uppercase text-center'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span 
          onClick={handleDelete} 
          className="font-semibold text-red-700 cursor-pointer">
        Delete Account</span>
        <span
          onClick={handleSignout}
          className="font-semibold text-red-700 cursor-pointer">
        Sign Out</span>
      </div>
      <p
          hidden={updateStatus === undefined} 
          className="font-semibold my-2">
          {
            updateStatus?
            updateStatus.success === true?
              <span className="text-green-700">
                {updateStatus.message}
              </span> :
              <span className="text-red-700">
                {`Error: ${updateStatus.message}`}
              </span>
            :
            ''
          }
        </p> 
    </div>
  )
}

export default Profile