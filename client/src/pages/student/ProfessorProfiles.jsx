import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Footer from './Footer';

export default function ProfessorProfiles() {
  const [professorData, setProfessorData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Current page of pagination
  const [profilesPerPage, setProfilesPerPage] = useState(4); // Number of profiles to display per page
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Current viewport width
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
      console.log(data);
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
  const filteredProfiles = professorData
    ? professorData.filter(professor =>
        professor.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src="https://indiaeducationdiary.in/wp-content/uploads/2020/07/SRMAP-LOGO.jpg" alt="Loading..." style={{ width: "200px", height: "auto" }} />
      </div>
    );
  }

  return (
    <div className="main-content" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className='flex flex-col md:flex-row justify-between'>
      <div className="flex justify-center items-center mb-4 relative border border-gray-300 rounded-lg shadow-sm">
        
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-11.707a1 1 0 010 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414 7.707 13.707a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 111.414-1.414L10 8.586l2.293-2.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-4">
        {currentProfiles.map((professor, index) => (
          <div
            className="bg-white shadow-md hover:shadow-md hover:shadow-teal-200 transform hover:-translate-y-0.5 transition duration-200 ease-in-out rounded-md overflow-hidden"
            key={index}
          >
            <a
              href={professor.profilelink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={professor.profilephoto}
                alt={professor.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Name: {professor.name}</h3>
                <p className="text-gray-800 font-bold mt-2 truncate">Designation: {professor.designation}</p>
                <p className="text-gray-800 font-bold mt-2">Email: {professor.emailid}</p>
              </div>
            </a>
          </div>
        ))}
      </div>

      {professorData && (
        <div className="p-4">
          <ReactPaginate
            pageCount={Math.ceil(filteredProfiles.length / profilesPerPage)}
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
