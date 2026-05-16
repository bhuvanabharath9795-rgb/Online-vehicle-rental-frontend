import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-orange-100 bg-gradient-to-b from-white to-orange-50">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* About Us */}
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-4">About Us</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-5">
            DriveNow is a trusted vehicle rental platform focused in India.
            We connect vehicle owners with customers who choose from a wide selection of cars, bikes, vans and trucks at affordable prices, promoting smart and convenient transportation solutions.
          </p>
          <div className="flex items-start gap-2">
            <span className="text-orange-500 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </span>
            <div className="text-sm text-slate-700">
              <p className="font-semibold text-slate-900">DriveNow India</p>
              <p>1st Floor, Kamaraj Nagar, No: 134,</p>
              <p>Mangadu Main Road,</p>
              <p>Mugalivakkam, Bai Kadai, Chennai</p>
              <p>Pin: 600116</p>
            </div>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-4">Company</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors">Terms and Conditions</Link>
            </li>
            <li>
              <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors">FAQs</Link>
            </li>
            <li>
              <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors">Blogs</Link>
            </li>
            <li>
              <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors">Sitemap</Link>
            </li>
          </ul>
        </div>

        {/* Our Services */}
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-4">Our Services</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors">Daily Drives</Link>
            </li>
            <li>
              <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors">Subscription</Link>
            </li>
            <li>
              <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors">Vehicle Hosts</Link>
            </li>
            <li>
              <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors">Corporate Rentals</Link>
            </li>
          </ul>

          {/* Social Icons */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-900 mb-3">Follow Us</p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-orange-100 bg-gradient-to-r from-orange-500 to-yellow-500">
        <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-white text-center font-medium">
          © 2026 DriveNow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
