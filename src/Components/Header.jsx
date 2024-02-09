import React from "react";
import "../scss/header.scss";
import NavBar from "./NavBar";

const Header = () => {
  return (
    <div className="header-con">
      <h1 className="navbar-title">G.S.C </h1>
      <NavBar />
    </div>
  );
};

export default Header;
