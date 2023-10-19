import { IoMdArrowDropdown } from "react-icons/io";
import NavBar from "./nav/NavBar";
import NavDropdown from "./nav/NavDropdown";
import NavItem from "./nav/NavItem";
import { GetUser, User, Role, useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";

const PopulatedNavBar = () => {
  const user = useAuth();

  return (
    <NavBar>
      <NavItem route="/">SPEED</NavItem>
      
      {user !== null && user.role < Role.MODERATOR && (
        <NavItem route="/moderation" end>
          Moderation
        </NavItem>
      )}

      <NavItem end>{"\u0000"}</NavItem>

      <NavItem route="/search">Search</NavItem>

      <NavItem dropdown route="/articles">
        Articles <IoMdArrowDropdown />
        <NavDropdown>
          <NavItem route="/articles">View articles</NavItem>
          <NavItem route="/articles/new">Submit new</NavItem>
        </NavDropdown>
      </NavItem>

      {user === null ? (
        <NavItem route="/login">
          Login
        </NavItem>
      ) : (
        <NavItem route="/logout">
          {user.username}
        </NavItem>
      )}
      
      </NavBar>
  );
};
export default PopulatedNavBar;
