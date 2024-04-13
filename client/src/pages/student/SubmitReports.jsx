import React, {useState, useEffect} from 'react'
import { storage } from '../config';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import "./Navbar.css";

export default function SubmitReports() {
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [teamId, setTeamId] = useState('');
  const [project, setProject] = useState(null); // Moved project state to the top level

  useEffect(() => {
    fetchTeamId();
  }, []);

  const fetchTeamId = async () => {
    try {
      const rollNumber=localStorage.getItem('rollNumber');
      const res = await fetch('http://localhost:3000/api/team/isinTeam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({studentId:rollNumber}),
      });
      const data = await res.json();
      setTeamId(data.teamcode);
      getmyproject(data.teamcode);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]
    const foldername=teamId;
    if (file.type==="application/pdf"){
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
    }else{
      alert("Please upload a PDF file")
    }
  }

  const savetoteam = async (downloadURL) => {
    try {
      const res = await fetch('http://localhost:3000/api/project/addreportlink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({teamcode:teamId,reportlink:downloadURL}),
      });
      const data = await res.json();
    } catch (error) {
      console.log(error);
    }
  }

  const getmyproject = async (teamcode) => {
    try{
      const res = await fetch('http://localhost:3000/api/project/getacceptedproject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({teamcode:teamcode}),
      });
      const data = await res.json();
      setProject(data);
    }catch(error){
      console.log(error);
    }
  }

  return (
    <div className="App main-content">
      {project && project.length > 0 ? ( // Modified the condition here to check if project exists and has length > 0
        <div>
          <div>
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
          <div>
            <h2>Project Details</h2>
            <p>Project Name: {project[0].projectName}</p>
            <p>Project Description: {project[0].projectDescription}</p>
          </div>
          <div>
            <h2>Reports</h2>
            <ul>
              {project[0].reports.map((report, index) => (
                <li key={index}>
                  <a href={report} target="_blank" rel="noreferrer">Report {index + 1}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>No project accepted</p>
      )}
    </div>
  );
}
