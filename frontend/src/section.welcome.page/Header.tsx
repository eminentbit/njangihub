import React, { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Button from "../components/Button";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "../store/create.auth.store";
import { useCreateNjangiStore } from "../store/create.njangi.store";

interface NavLinkItem {
  label: string;
  to: string;
  scroll: boolean;
}

const navLinks: NavLinkItem[] = [
  // In-page scroll sections
  { label: "Features", to: "features", scroll: true },
  { label: "How It Works", to: "how-it-works", scroll: true },
  { label: "Pricing", to: "pricing", scroll: true },
  { label: "Testimonials", to: "testimonials", scroll: true },
  { label: "FAQ", to: "faq", scroll: true },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuthStore();
  const { draftId } = useCreateNjangiStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between py-4">
          {/* Logo and Home nav */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
          >
            <img src="/logo5.png" alt="Logo" className="h-11" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) =>
              link.scroll ? (
                <ScrollLink
                  key={index}
                  to={link.to}
                  smooth
                  duration={500}
                  className="text-gray-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  {link.label}
                </ScrollLink>
              ) : (
                <Link
                  key={index}
                  to={link.to}
                  className="text-gray-600 hover:text-blue-700 font-medium"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (!user) {
                  navigate("/login");
                  return;
                }
                if (user.role == "bod") {
                  navigate("/board/dashboard");
                  return;
                } else if (user.role == "member") {
                  navigate("/user/dashboard");
                  return;
                }
                navigate(`${user.role}/dashboard`);
              }}
            >
              {!user ? "Login" : "Dashboard"}
            </Button>
            {draftId && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() =>
                  navigate(`/njangi-state-dashboard?draftId=${draftId}`)
                }
              >
                State Dashboard
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <Container>
            <nav className="flex flex-col py-4 space-y-4">
              {navLinks.map((link, index) =>
                link.scroll ? (
                  <ScrollLink
                    key={index}
                    to={link.to}
                    smooth
                    duration={500}
                    className="text-gray-600 hover:text-blue-700 font-medium cursor-pointer py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </ScrollLink>
                ) : (
                  <Link
                    key={index}
                    to={link.to}
                    className="text-gray-600 hover:text-blue-700 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                    return;
                  }
                  if (user.role == "bod") {
                    navigate("/board/dashboard");
                    return;
                  } else if (user.role == "member") {
                    navigate("/user/dashboard");
                    return;
                  }
                  navigate(`${user.role}/dashboard`);
                }}
              >
                {!user ? "Login" : "Dashboard"}
              </Button>
              {draftId && (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() =>
                    navigate(`/njangi-state-dashboard?draftId=${draftId}`)
                  }
                >
                  State Dashboard
                </Button>
              )}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
};

export default Header;
