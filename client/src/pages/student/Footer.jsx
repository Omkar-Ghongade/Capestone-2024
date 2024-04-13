import React from 'react';
import { FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-teal-950 text-white py-4 mt-2">
      <div className="container mx-auto flex flex-wrap justify-between">
        {/* University name and address */}
        <div className="w-full md:w-1/2 p-4">
          <h3 className="text-lg font-semibold mb-2">SRM University - <i>AP</i></h3>
          <p>Mangalagiri -Mandal, Neeru Konda, Guntur,</p>
          <p>Amravati, India - 522502</p>
        </div>

        {/* Contact Admin */}
        <div className="w-full md:w-1/4 p-4">
          <h3 className="text-lg font-semibold mb-2">Contact Admin</h3>
          <ul>
            <li>Email 1: admin1@example.com</li>
            <li>Email 2: admin2@example.com</li>
          </ul>
        </div>

        {/* Follow us */}
        <div className="w-full md:w-1/4 flex flex-col py-2 p-4">
          <h2 className="text-xl font-semibold mr-4 mb-2">Follow us</h2>
          <div className="flex space-x-4">
            <a href="#" className="text-white">
              <FaInstagram size={24}/>
            </a>
            <a href="#" className="text-white">
              <FaLinkedin size={24}/>
            </a>
            <a href="#" className="text-white">
              <FaFacebook size={24}/>
            </a>
          </div>
        </div>
      </div>
      <p className="text-center mt-4">HandCrafted by: Achyut, Aditya and Omkar</p>
    </footer>
  );
}

export default Footer;