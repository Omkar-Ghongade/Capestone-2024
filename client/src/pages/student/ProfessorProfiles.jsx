import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import "./Navbar.css";

export default function ProfessorProfiles() {
  const [professorData, setProfessorData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Current page of pagination
  const [profilesPerPage, setProfilesPerPage] = useState(4); // Number of profiles to display per page
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Current viewport width
  const [loading, setLoading] = useState(true);
  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfessorData();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    updateProfilesPerPage();
  }, [windowWidth]);

  const fetchProfessorData = async () => {
    try {
      const res = await fetch(`${api}/api/professor/getprofessordata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setProfessorData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const updateProfilesPerPage = () => {
    if (windowWidth < 640) {
      setProfilesPerPage(8); // For small screens, show 8 profiles per page
    } else if (windowWidth < 1024) {
      setProfilesPerPage(16); // For medium screens, show 16 profiles per page
    } else {
      setProfilesPerPage(32); // For large screens, show 32 profiles per page
    }
  };

  const indexOfLastProfile = (currentPage + 1) * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = professorData ? professorData.slice(indexOfFirstProfile, indexOfLastProfile) : [];

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

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
    <div className='main-content'>
      <div className='text-3xl mt-2 mb-2 text-center josefin-sans'><h1>Professor Profiles</h1></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-4">
        
        {currentProfiles.map((professor, index) => (
          <div className="bg-white shadow-md hover:shadow-lg hover:shadow-teal-100 rounded-md overflow-hidden" key={index}>
            <img src={professor.profilephoto} alt={professor.name} className="max-w-360px max-h-200px w-full h-41 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Name: {professor.name}</h3>
              <p className="text-gray-800 font-bold mt-2">Email: {professor.emailid}</p>
            </div>
          </div>
        ))}
      </div>
      {professorData && (
        <div className="p-4">
        <ReactPaginate
          pageCount={Math.ceil(professorData.length / profilesPerPage)}
          onPageChange={handlePageChange}
          containerClassName="pagination"
          activeClassName="active"
          previousLabel="Previous"
          nextLabel="Next"
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
        />
        </div>
      )}
    </div>
  );
}