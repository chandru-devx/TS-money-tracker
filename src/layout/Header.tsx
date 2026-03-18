import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";



const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
];

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // const [loading, setLoading] = useState(true)

  const [userData, setUserData] = useState<User | null>(null)


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserData(user)
      // setLoading(false)
    })

    return () => unsubscribe()
  }, [])


  const handleLogin = () => {
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-gray-800 text-white fixed w-full z-20 top-0 border-b border-gray-700">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">

        {/* Logo */}
        <a href="/" className="flex items-center space-x-3">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-7"
            alt="logo"
          />
          <span className="text-2xl font-bold text-gray-200">
            Money-Tracker
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 font-medium">
          {/* {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-sky-400 transition"
            >
              {link.label}
            </a>
          ))} */}

          {userData && (
            <Link to="/profile">
              <CgProfile size={30}/>
            </Link>
          )}

          {/* {!loading && userData && (
            <Link to="/profile">
              <CgProfile />
            </Link>
          )} */}

        </div>


        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded hover:bg-gray-700"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="M5 7h14M5 12h14M5 17h14"
            />
          </svg>
        </button>

      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="flex flex-col p-4 space-y-3">

            {/* {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-sky-400 transition"
              >
                {link.label}
              </a>
            ))} */}

           {userData && (
            <Link to="/profile">
            <div className="flex gap-3.5">
                <CgProfile size={30}/>
              <p>Profile</p>
            </div>
            </Link>
          )}

          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;