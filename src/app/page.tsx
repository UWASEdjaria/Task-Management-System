
import Login from './auth/login/page'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      {/* Gray card containing both login and content */}
      <div className="flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden max-w-5xl w-full bg-white">

        {/* Login section in white */}
        <div className="bg-white p-8 md:w-1/2 flex flex-col justify-center">
          <Login />
        </div>

        {/* Home page content (H1 + paragraph) in block stacked */}
        <div className="bg-gray-200 p-8 md:w-1/2 flex flex-col justify-center text-center hidden md:flex">
          <h1 className="text-2xl md:text-4xl font-bold text-black mb-4">
            Organize your work and track progress easily
          </h1>
          <p className="text-sm md:text-base text-gray-700 font-sans">
            Collaborate with your team, stay organized, and get more done every day.
          </p>
        </div>

      </div>
    </div>
  )
}