import { IoMdArrowDropdown } from "react-icons/io";
import NavBar from "./nav/NavBar";
import NavDropdown from "./nav/NavDropdown";
import NavItem from "./nav/NavItem";
import { Role, useAuth } from "@/lib/auth";

const PopulatedNavBar = () => {
  const user = useAuth();

  return (
    <NavBar>
      <NavItem route="/">SPEED</NavItem>

      <NavItem end>{"\u0000"}</NavItem>
      <NavItem route="/moderation">Moderation </NavItem>
      <NavItem route="/analyst">Analyst </NavItem>
      <NavItem route="/search">Search</NavItem>

      <NavItem dropdown route="/articles">
        Articles <IoMdArrowDropdown />
        <NavDropdown>
          <NavItem route="/articles">View articles</NavItem>
          <NavItem route="/articles/new">Submit new</NavItem>
        </NavDropdown>
      </NavItem>

      {user === null ? (
        <NavItem route="/login">Login</NavItem>
      ) : (
        <NavItem dropdown>
          {user.username} <IoMdArrowDropdown />
          <NavDropdown>
            {user.role == Role.ADMIN && (
              <NavItem route="/admin">Administration</NavItem>
            )}

            {user.role == Role.ANALYST ||
              (user.role == Role.ADMIN && (
                <NavItem route="/analyst">Analysis</NavItem>
              ))}

            {user.role == Role.MODERATOR ||
              (user.role == Role.ADMIN && (
                <NavItem route="/moderation">Moderation</NavItem>
              ))}

            <NavItem route="/logout">Log Out</NavItem>
          </NavDropdown>
        </NavItem>
      )}
    </NavBar>
  );
};
export default PopulatedNavBar;
