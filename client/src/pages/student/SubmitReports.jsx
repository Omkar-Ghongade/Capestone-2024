import React, { useState, useEffect } from 'react';
import { storage } from '../config';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import "./Navbar.css";

export default function SubmitReports() {
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [teamId, setTeamId] = useState('');
  const [project, setProject] = useState(null); // Moved project state to the top level
  const [loading, setLoading] = useState(true);
  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    fetchTeamId();
  }, []);

  const fetchTeamId = async () => {
    try {
      const rollNumber = localStorage.getItem('rollNumber');
      const res = await fetch(`${api}/api/team/isinTeam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: rollNumber }),
      });
      const data = await res.json();
      setTeamId(data.teamcode);
      getmyproject(data.teamcode);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]

    const foldername = teamId;
    if (file.type === "application/pdf") {

      const storageRef = ref(storage, `${foldername}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed",
        (snapshot) => {
          const progress =
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgresspercent(progress);
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImgUrl(downloadURL)
            savetoteam(downloadURL);
          });
        }
      );

    } else {

      alert("Please upload a PDF file")
    }
  }

  const savetoteam = async (downloadURL) => {
    try {
      const res = await fetch(`${api}/api/project/addreportlink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamcode: teamId, reportlink: downloadURL }),
      });
      const data = await res.json();
    } catch (error) {
      console.log(error);
    }
  }

  const getmyproject = async (teamcode) => {

    try {

      const res = await fetch(`${api}/api/project/getacceptedproject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamcode: teamcode }),
      });
      const data = await res.json();
      setProject(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img 
          src="https://srmap.edu.in/file/2019/12/Logo-2.png" 
          alt="Loading..." 
          style={{ width: "200px", height: "auto" }} 
        />
      </div>
    );
  }

  return (

    <div className=" main-content flex flex-col items-center">
      <div className="bg-white rounded-lg shadow-md w-full px-4 ">
        {project && project.length > 0 ? (
          <div>
            <div>
              <h2 className="text-2xl font-bold mt-4">Project Details</h2>
              <p className='text-lg'>Project Name: {project[0].projectName}</p>
              <p className='text-lg' >Project Description: {project[0].projectDescription}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mt-4">Reports</h2>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6  gap-2 ">
                {project[0].reports.map((report, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md mb-2 border-solid border-2 ">
                    
                    <a href={report} target="_blank" rel="noreferrer">
                      <img src="https://logodownload.org/wp-content/uploads/2021/05/adobe-acrobat-reader-logo-0-1536x1536.png" alt="Report Placeholder" className=" h-48 rounded-t-lg w-full object-cover mb-1" />
                      <p className='text-center'>Report {index + 1}</p>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className='mt-4'>
              <form onSubmit={handleSubmit} className='form'>
                <input type='file' />
                <button type='submit'>Upload</button>
              </form>
              {
                !imgUrl &&
                <div className='outerbar'>
                  <div className='innerbar' style={{ width: `${progresspercent}%` }}>{progresspercent}%</div>
                </div>
              }
            </div>
            
          </div>
        ) : (
          <p>No project accepted</p>
        )}
      </div>
    </div>
  );
}
