import React, { useState } from "react";
import { ProjectDropdown } from "./NavItems";
import { Link } from "react-router-dom";
import "./Navbar.css"

function Dropdown() {
  const [dropdown, setDropdown] = useState(false);

  return (
    <>
    
      <ul
        className={dropdown ? "services-submenu clicked" : "services-submenu"}
        onClick={() => setDropdown(!dropdown)}
      >
        {ProjectDropdown.map((item) => {
        
          return (
            
            <li key={item.id}>
              <Link
                to={item.path}
                className={item.cName}
                onClick={() => setDropdown(false)}

              >
                
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default Dropdown;