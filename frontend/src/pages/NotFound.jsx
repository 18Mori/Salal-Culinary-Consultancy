import { Link } from 'react-router-dom';

function NotFound() {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <h1 className="text-9xl font-bold text-primary opacity-20"
            aria-hidden="true">
              404
            </h1>
          </div>
        </div>
        <h2 className="flex justify-center mb-6 text-2xl font-medium text-onBackground ">Page Not Found</h2>
        <p className="flex justify-center mb-6 text-onBackground/70">
          The page you're looking for doesn't exist. Let's get you back!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="bg-gray-50 text-gray-500 hover:text-black py-2 px-4 rounded">
              Go to Home
          </Link>
        </div>
    </div>
}

export default NotFound