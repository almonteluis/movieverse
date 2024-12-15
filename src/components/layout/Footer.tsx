import { Link } from "react-router-dom";
import { Film, Twitter, Github, Mail } from "lucide-react";

const footer = () => {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col gap-8 py-8 md:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <Link to="/" className="flex items-center space-x-2">
              <Film className="h-6 w-6" />
              <span className="text-xl font-bold">MovieVerse</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your ultimate destination for movies.
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Movies</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/trending" className="hover:text-primary">
                    Trending
                  </Link>
                </li>
                <li>
                  <Link to="/popular" className="hover:text-primary">
                    Popular
                  </Link>
                </li>
                <li>
                  <Link to="/upcoming" className="hover:text-primary">
                    Upcoming
                  </Link>
                </li>
                <li>
                  <Link to="/top-rated" className="hover:text-primary">
                    Top Rated
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Categories</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/action" className="hover:text-primary">
                    Action
                  </Link>
                </li>
                <li>
                  <Link to="/comedy" className="hover:text-primary">
                    Comedy
                  </Link>
                </li>
                <li>
                  <Link to="/drama" className="hover:text-primary">
                    Drama
                  </Link>
                </li>
                <li>
                  <Link to="/horror" className="hover:text-primary">
                    Horror
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/about" className="hover:text-primary">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-primary">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-primary">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-primary">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MovieVerse. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              to="#"
              className="text-muted-foreground hover:text-foreground"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              to="#"
              className="text-muted-foreground hover:text-foreground"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              to="#"
              className="text-muted-foreground hover:text-foreground"
            >
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default footer;
