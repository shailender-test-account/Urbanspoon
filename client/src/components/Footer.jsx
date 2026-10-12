import { Link } from 'react-router-dom';

const social = ['facebook-f', 'instagram', 'twitter', 'youtube'];

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-12 border-b border-gray-800">
          <div>
            <h3 className="text-lg font-bold mb-2">Stay Updated!</h3>
            <p className="text-gray-400 text-xs mb-4">Subscribe to get exclusive offers, foodie deals & updates.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex bg-white/5 rounded-xl p-1 max-w-md border border-white/10">
              <input type="email" required placeholder="Enter your email" className="bg-transparent border-none outline-none text-xs px-4 py-2.5 w-full text-white placeholder-gray-500" />
              <button className="bg-primary hover:bg-primaryHover text-white px-5 py-2.5 rounded-lg font-semibold transition text-xs whitespace-nowrap">Subscribe</button>
            </form>
          </div>
          <div className="flex flex-col lg:items-end">
            <h3 className="text-lg font-bold mb-2">Download Our App</h3>
            <p className="text-gray-400 text-xs mb-4">Get the app for a faster & better experience.</p>
            <div className="flex gap-3">
              <a href="#" className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2 transition">
                <i className="fa-brands fa-google-play text-xl text-primary" />
                <div className="text-left"><p className="text-[8px] text-gray-400 uppercase">Get it on</p><p className="text-xs font-bold">Google Play</p></div>
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2 transition">
                <i className="fa-brands fa-apple text-xl text-primary" />
                <div className="text-left"><p className="text-[8px] text-gray-400 uppercase">Download on the</p><p className="text-xs font-bold">App Store</p></div>
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-primary text-xl"><i className="fa-solid fa-utensils" /></div>
              <span className="font-extrabold text-base">Urban Spoon</span>
            </div>
            <p className="text-gray-400 text-[10px] mb-4">Good food, great taste & fast delivery at your doorstep.</p>
            <div className="flex gap-3">
              {social.map((s) => (
                <a key={s} href="#" className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition">
                  <i className={`fa-brands fa-${s} text-xs`} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-xs mb-4 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/menu" className="hover:text-primary">Menu</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link to="/my-bookings" className="hover:text-primary">My Bookings</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#" className="hover:text-primary">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Refund Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs mb-4 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex gap-2"><i className="fa-solid fa-phone text-primary mt-0.5" /><span>+1 (888) 123-4567</span></li>
              <li className="flex gap-2"><i className="fa-solid fa-envelope text-primary mt-0.5" /><span>hello@urbanspoon.com</span></li>
              <li className="flex gap-2"><i className="fa-solid fa-location-dot text-primary mt-0.5" /><span>123 Foodie Street,<br />New York, NY 10001</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-500">© {new Date().getFullYear()} Urban Spoon Restaurant. All rights reserved.</p>
          <div className="flex items-center gap-2 text-primary font-bold italic text-xs">
            <span>Good Food</span><i className="fa-regular fa-heart animate-pulse" /><span>Good Mood</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
