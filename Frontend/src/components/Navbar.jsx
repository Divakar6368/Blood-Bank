import { NavLink } from "react-router";
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between  navbar backdrop-blur-md  border-b border-base-200 bg-base-100/80  top-0 z-50 px-4 md:px-8">
      <h1 className='text-xl md:text-4xl'>Home</h1>
      <div className="flex-none gap-3">
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `btn btn-sm md:btn-md ${isActive ? 'btn-neutral' : 'btn-ghost'}`
          }>
          Log In
        </NavLink>
          
        <NavLink
          to="/signup"
          className={({ isActive }) =>
            `btn btn-sm md:btn-md gap-2 ${isActive ? 'btn-accent' : 'btn-primary'}`
          }>
          Sign Up
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar;