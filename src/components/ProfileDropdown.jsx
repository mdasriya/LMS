import { useRef, useState } from "react";
import { AiOutlineCaretDown } from "react-icons/ai";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";
import "./ProfileDropdown.css";


export default function ProfileDropdown({ handleLogout }) {
  const user = {
    FullName: "Admin Bhai",
    Image: `https://api.dicebear.com/5.x/initials/svg?seed=${"Admin Bhai"}`,
  };

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleLogoutClick = () => {
    handleLogout(); // Ensure that handleLogout is called when the button is clicked
    navigate("/admin");
  };

  if (!user) return null;

  return (
    <button className="profile-dropdown-button" onClick={() => setOpen(!open)}>
      <div className="profile-dropdown-content">
        <img
          src={user?.Image}
          alt={`profile-${user?.FullName}`}
          className="profile-image"
        />
        <AiOutlineCaretDown className="profile-caret-icon" />
      </div>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="profile-dropdown-menu"
          ref={ref}
        >
          <Link to="/userProfile" onClick={() => setOpen(false)}>
            <div className="profile-menu-item">
              <VscDashboard className="menu-icon" />
              MyProfile
            </div>
          </Link>
          <div
            onClick={() => {
              handleLogoutClick();
              setOpen(false);
            }}
            className="profile-menu-item"
          >
            <VscSignOut className="menu-icon" />
            Logout
          </div>
        </div>
      )}
    </button>
  );
}
