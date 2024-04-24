/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux"
import {app} from '../firebase.js';


const Profile = () => {
  const fileRef = useRef(null);
  const {currentUser} = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(false); 
  const [filePerc, setFilePerc] = useState(0);

  useEffect(() => {
    if (file){
      handleFileUpload(file);
    }
  }, [file]);
  
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on('state_changed', 
      (snapshot) => {
        setFilePerc(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (url) => {
            setFormData({...formData, avatar: url });
            console.log(formData);
          }
        );
      }
    );
  
    // Mulai proses pengunggahan
    uploadTask.resume();
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
        <p>
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
        <input type="text" placeholder="Username"
        className="border p-3 rounded-lg"/>
        <input type="email" placeholder="Email"
        className="border p-3 rounded-lg"/>
        <input type="password" placeholder="Password"
        className="border p-3 rounded-lg"/>
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="font-semibold text-red-700 cursor-pointer">
        Account</span>
        <span className="font-semibold text-red-700 cursor-pointer">
        Sign Out</span>
      </div>
    </div>
  )
}

export default Profile