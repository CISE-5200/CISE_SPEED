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
        <NavItem dropdown>
          {user.username} <IoMdArrowDropdown />
          <NavDropdown>
            {user.role == Role.MODERATOR && (
              <NavItem route="/moderation">
                Moderation
              </NavItem>
            )}

            {user.role == Role.ANALYST && (
              <NavItem route="/analyst">
                Analysis
              </NavItem>
            )}

            {user.role == Role.ADMIN && (
              <NavItem route="/admin">
                Administration
              </NavItem>
            )}

            <NavItem route="/logout">
              Log Out
            </NavItem>
          </NavDropdown>
        </NavItem>
      )}
      
      </NavBar>
  );
};
export default PopulatedNavBar;
