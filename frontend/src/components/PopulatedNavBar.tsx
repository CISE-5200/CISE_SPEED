import { IoMdArrowDropdown } from "react-icons/io";
import NavBar from "./nav/NavBar";
import NavDropdown from "./nav/NavDropdown";
import NavItem from "./nav/NavItem";
const PopulatedNavBar = () => {
  return (
    <NavBar>
      <NavItem route="/">SPEED</NavItem>
      <NavItem route="/moderation" end>
        Moderation
      </NavItem>
      <NavItem route="/search">Search</NavItem>

      <NavItem dropdown route="/articles">
        Articles <IoMdArrowDropdown />
        <NavDropdown>
          <NavItem route="/articles">View articles</NavItem>
          <NavItem route="/articles/new">Submit new</NavItem>
        </NavDropdown>
      </NavItem>
    </NavBar>
  );
};
export default PopulatedNavBar;
