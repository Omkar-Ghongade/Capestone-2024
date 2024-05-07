import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { IoIosClose } from "react-icons/io";

import { set } from "mongoose";
import Footer from "./Footer";

export default function ProjectsList() {
  const [loading, setLoading] = useState(true);

  const [FilterbarOpen, setFilterbarOpen] = useState(true); // State to manage Filterbar visibility

  const [projectData, setProjectsData] = useState(null);
  const [finalcount, setFinalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isApply, setIsApply] = useState(false);
  const [applyReason, setApplyReason] = useState("");
  const [filters, setFilters] = useState({
    filter1: false,
    filter2: false,
    // Add more filters here
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage, setProjectsPerPage] = useState(10); // Number of projects to display per page
  const [filteredProjectsData, setFilteredProjectsData] = useState([]);
  const [validteam, setValidTeam] = useState(false);
  const [teamid, setTeamId] = useState("");
  const [applied, setApplied] = useState(false);
  const [acceptance, setAcceptance] = useState(false);
  const [teamsize, setTeamsize] = useState(0);
  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    const fetchData = async () => {
      await isvalidteam();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchProjectData();
    };
    fetchData();
  }, [teamsize]);

  useEffect(() => {
    const isApplyStored = localStorage.getItem("isApply");
    const selectedProjectStored = localStorage.getItem("selectedProject");
    if (isApplyStored) {
      setIsApply(JSON.parse(isApplyStored));
    }
    if (selectedProjectStored) {
      setSelectedProject(JSON.parse(selectedProjectStored));
    }
    setIsApply(false);
  }, []);

  const isvalidteam = async () => {
    try {
      const rollNumber = localStorage.getItem("rollNumber");
      const res = await fetch(`${api}/api/team/isinteam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId: rollNumber }),
      });
      const data = await res.json();
      console.log(data);
      if (data.submitted) {
        setTeamId(data.teamcode);
        finalproject(data.teamcode);
        setTeamsize(data.teammembers.length);
        console.log(teamid);
        setValidTeam(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const finalproject = async (teamcode) => {
    try {
      const res = await fetch(`${api}/api/project/isteamprojectaccept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamcode: teamcode }),
      });
      const data = await res.json();
      // console.log(data.isaccepted);
      setAcceptance(data.isaccepted);
    } catch (error) {
      console.log(error);
    }
  };

  async function isTeamSubmitted(projectName) {
    console.log(teamid);
    console.log(projectName);
    const submitted = await isSubmitted(teamid, projectName);
    console.log(submitted);
    return submitted;
  }

  const isSubmitted = async (teamcode, projectName) => {
    try {
      const res = await fetch(`${api}/api/project/isteamproject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamcode, projectName }),
      });
      const data = await res.json();
      console.log(data);
      if (data.projectName === projectName) return true;
      return false;
    } catch (error) {
      return false;
      console.log(error);
    }
  };

  const fetchProjectData = async () => {
    try {
      const res = await fetch(`${api}/api/project/getprojectdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      const teamsizedData = data.filter(
        (project) =>
          teamsize >= project.minteamsize && teamsize <= project.maxteamsize
      );
      setProjectsData(teamsizedData);
      console.log(teamsize);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectData) return;

    const filteredData = filterProjects();
    setFilteredProjectsData(filteredData);
    setCurrentPage(1);
  }, [filters, projectData, searchQuery]);

  const filterProjects = () => {
    if (!projectData) return [];
    return projectData.filter(
      (project) =>
        project.isopen &&
        (!Object.keys(filters).some((domain) => filters[domain]) ||
          project.domains.some((domain) => filters[domain])) &&
        (project.professor.toLowerCase().includes(searchQuery.toLowerCase()) || project.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (filterName, isChecked) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: isChecked,
    }));
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const pagesVisited = (currentPage - 1) * projectsPerPage;
  const currentProjects = filteredProjectsData.slice(
    pagesVisited,
    pagesVisited + projectsPerPage
  );
  const pageCount = Math.ceil(filteredProjectsData.length / projectsPerPage);

  const applyProjectClick = async (project) => {
    setSelectedProject(project);
    setIsApply(true);
    localStorage.setItem("isApply", JSON.stringify(true));
    localStorage.setItem("selectedProject", JSON.stringify(project));

    const submitted = await isTeamSubmitted(project.name);
    if (submitted) {
      setApplied(true);
    } else setApplied(false);
  };

  const cancelApply = () => {
    setSelectedProject(null);
    setIsApply(false);
    localStorage.removeItem("isApply");
    localStorage.removeItem("selectedProject");
  };

  const handleApplyReasonChange = (event) => {
    setApplyReason(event.target.value);
  };

  const handleSubmit = async () => {
    const minWords = 50;
    const words = applyReason.trim().split(/\s+/);
    if (words.length < minWords) {
      alert(`Minimum ${minWords} words are required for the apply reason.`);
      return;
    }

    var Description = "";

    try {
      const res = await fetch(`${api}/api/project/getaprojectdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectname: selectedProject.name }),
      });
      const data = await res.json();
      Description = data.description;
      console.log(description);
    } catch (error) {
      console.log(error);
    }

    const data = {
      projectId: selectedProject._id,
      projectName: selectedProject.name,
      projectDomain: selectedProject.domains,
      projectProfessor: selectedProject.professor,
      projectDescription: Description,
      applyReason: applyReason,
      studentId: localStorage.getItem("rollNumber"),
    };

    console.log(selectedProject.domains);

    console.log(data);
    try {
      const res = await fetch(`${api}/api/project/applyproject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      // console.log(result);

      cancelApply();
    } catch (error) {
      // console.log(error);
      alert("Error in applying project. Please try again.");
      cancelApply;
    }
  };

  const toggleSidebar = () => {
    setFilterbarOpen(!FilterbarOpen);
  };

  const ProjectFilter = () => {
    if (!projectData) {
      return 0;
    }
    const allDomains = projectData.reduce((domains, project) => {
      project.domains.forEach((domain) => {
        if (!domains.includes(domain)) {
          domains.push(domain);
        }
      });
      return domains;
    }, []);

    const handleDeselectAll = () => {
      const updatedFilters = {};
      allDomains.forEach((domain) => {
        updatedFilters[domain] = false;
      });
      setFilters(updatedFilters);
    };

    return (
      <div
        className={` p-4 ${
          (!FilterbarOpen || isApply) && "invisible"
        }`}
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <h2 className="text-xl font-bold mb-2">Filter Projects</h2>
        <div className="flex flex-col space-y-2">
          {allDomains.map((domain, index) => (
            <div
              key={index}
              className="checkbox-wrapper-42 inline-flex items-center"
            >
              <input
                type="checkbox"
                id={`cbx-${index}`}
                className="form-checkbox h-4 w-4 text-indigo-600"
                onChange={(e) => {
                  handleFilterChange(domain, e.target.checked);
                }}
                checked={filters[domain]} // Ensure checkbox state is controlled
              />
              <label className="cbx" htmlFor={`cbx-${index}`}></label>
              <label className="lbl" htmlFor={`cbx-${index}`}>
                {domain}
              </label>
            </div>
          ))}
          <button
            onClick={handleDeselectAll}
            className="mt-2 mb-2 h-7 text-sm w-24 bg-[#4D4D29] shadow-sm shadow-teal-100 hover:bg-[#535353] text-white font-semibold px-2 mt-2 rounded duration-300"
          >
            Deselect All
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 768) {
        setFilterbarOpen(false); // Small screens
      } else if (screenWidth >= 768 && screenWidth < 1024) {
        setFilterbarOpen(true); // Medium screens
      } else {
        setFilterbarOpen(true); // Large screens
      }
    };

    handleResize(); // Set initial projects per page based on current screen size
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* Loading screen content */}
        <img
          src="https://indiaeducationdiary.in/wp-content/uploads/2020/07/SRMAP-LOGO.jpg"
          alt="Loading..."
          style={{ width: "200px", height: "auto" }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="main-content mb-4">
        <button
          className={`fixed ${isApply && "invisible"} md:hidden bottom-10 right-8 bg-gray-700 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-teal-800 z-50`}
          onClick={toggleSidebar}
        >
          <div className="flex w-10 h-10 justify-center items-center">
            <FaFilter className="w-6 h-6 " />
          </div>
        </button>

        <div className=" flex flex-row gap-1">
          <div
            className={`${
              FilterbarOpen && !isApply ? "w-1/5 lg:w-2/12 px-2 z-40 " : "w-0"
            }   top-0 right-0 relative duration-500`}
          >
            {/* Responsive Filterbar */}
            <ProjectFilter handleFilterChange={handleFilterChange} />
          </div>

          <div
            className={`${
              FilterbarOpen ? "w-4/5 px-2 z-30 " : "w-full"
            } pr-2 pl-2 z-30 `}
          >
            {isApply ? (
              <div className="w-full h-full bg-white rounded-lg shadow-md p-6 sm:ml-8 md:ml-16 lg:ml-24 mt-4">
                <div className="flex flex-row justify-between">
                  <h2 className="text-2xl font-bold mb-3">Apply for Project</h2>
                  <button
                    onClick={cancelApply}
                    className="top-2 right-2 text-gray-600 hover:text-gray-800"
                  >
                    <IoIosClose size={32} />
                  </button>
                </div>

                <div className="mb-4 ">
                  <p className="mb-2">
                    <span className="font-bold">Name:</span>{" "}
                    {selectedProject.name}
                  </p>
                  <p className="mb-2">
                    <span className="font-bold">Description:</span>{" "}
                    {selectedProject.description}
                  </p>
                  <p className="h-1/6">
                    {selectedProject.domains.map((domain, idx) => (
                      <div
                        key={idx}
                        className="rounded-full bg-gray-200 px-2 py-1 text-sm inline-block mr-2 mb-2"
                      >
                        {domain}
                      </div>
                    ))}
                  </p>
                </div>

                {validteam ? (
                  acceptance ? (
                    <div className="text-red-500 my-4">
                      You have already been accepted for a project.
                    </div>
                  ) : applied ? (
                    <div className="text-red-500 my-4">
                      You have already applied for this project
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4">
                        <label
                          htmlFor="applyReason"
                          className="block text-sm font-bold mb-1"
                        >
                          Why do you want to apply?
                        </label>
                        <input
                          type="text"
                          id="applyReason"
                          className="w-full border rounded px-3 py-2"
                          value={applyReason}
                          onChange={handleApplyReasonChange}
                          autocomplete="off"
                        />
                      </div>
                      <div className="flex flex-row">
                        <button
                          onClick={cancelApply}
                          className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 mr-2"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmit}
                          className="bg-[#4D4D29] text-white font-bold py-2 px-4 rounded hover:bg-[#535353] mr-2"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-red-500 my-4">
                    Create and submit your team to start applying
                  </div>
                )}
              </div>
            ) : (
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Search By Professor Name or Project Name"
                  className="w-full border rounded px-3 py-2 ml-2"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                <div className='w-full flex flex-col gap-2 mb-4 mr-2 ml-2 mt-1 pt-2'>
                  {currentProjects.map((project, index) => (
                    <div key={index} className='flex flex-row w-full border-2 border-solid bg-white shadow-sm transform transition duration-200 ease-in-out rounded-lg overflow-hidden pb-2 pl-4 pt-2'>
                      <div className='pl-2 w-4/6 md:w-5/6 my-1'>
                        <h2 className='text-left text-xl mb-1 font-bold'>{project.name}</h2>
                        <p className='text-left mb-2 text-gray-600'>{project.professor}</p>
                        <div className='h-1/6'>
                          {project.domains.map((domain, idx) => (
                            <div key={idx} className="rounded-full bg-gray-200 px-3 py-2 text-sm inline-block mr-2 mb-2">{domain}</div>
                          ))}
                        </div>
                      </div>
                      <div className='w-2/6 md:w-1/6 flex justify-center items-center'>
                        <button onClick={() => applyProjectClick(project)} className='h-8 w-auto text-center bg-[#4D4D29] text-white font-bold px-4 rounded hover:bg-[#535353] mt-2 sm:mt-0'>View</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {projectData && isApply ? (
          <></>
        ) : (
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={Math.ceil(pageCount)}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            disabledClassName="pagination__link--disabled"
            activeClassName={"active"}
            forcePage={currentPage - 1}
          />
        )}
      </div>
      {/* <Footer /> */}
    </>
  );
}
