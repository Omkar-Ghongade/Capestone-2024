import React, { useState, useEffect } from 'react';
import { storage } from '../config';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";


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
      if(data!=null){
        setTeamId(data.teamcode);
        getmyproject(data.teamcode);
      }
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
            window.location.reload();
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
          src="https://indiaeducationdiary.in/wp-content/uploads/2020/07/SRMAP-LOGO.jpg" 
          alt="Loading..." 
          style={{ width: "200px", height: "auto" }} 
        />
      </div>
    );
  }

  return (
    <div className=' p-3 '>
      <div className={`${project.length === 0 ? 'h-screen' : ''} main-content flex flex-col items-center`} style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className={` bg-white  w-full px-4  `}>
          {project && project.length > 0 ? (
            <div>
              <div>
                <h2 className="text-2xl font-bold mt-4">{project[0].projectName}</h2>
                <p className='text-lg' ><b>Project Description : </b> {project[0].projectDescription}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mt-4">Submit & ViewReports</h2>
                <div className='mt-4'>
                <form onSubmit={handleSubmit} className='form flex flex-col md:flex-row md:items-center'>
                  <input type='file' className='mb-2 md:mb-0 md:mr-2' />
                  <button type='submit' className='bg-[#4D4D29] text-white rounded-lg shadow-md border-solid border-2 p-2'>Upload Report</button>
                </form>

                </div>
                <div className="flex space-x-2 pt-3">
                  {project[0].reports.map((report, index) => (
                    <div key={index} className="bg-[#4D4D29] text-white rounded-lg shadow-md mb-2 border-solid border-2 p-2">
                      <a href={report} target="_blank" rel="noreferrer">
                        <p className='text-center'>Report {index + 1}</p>
                      </a>
                    </div>
                  ))}
                </div>

              </div>
              
            </div>
          ) : (
            <p className='text-6xl mb-4 text-slate-300 text-center'>No projects accepted</p>
          )}
        </div>
      </div>
    </div>
  );
}
