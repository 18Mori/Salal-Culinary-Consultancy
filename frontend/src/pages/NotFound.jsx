import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 px-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="text-center space-y-6 relative z-10 max-w-md">
        <h1 className="text-8xl font-light tracking-tight text-amber-400 font-mono">
          404
        </h1>
        <h2 className="text-2xl font-light text-white">Page Not Found</h2>
        <p className="text-slate-400 text-sm leading-relaxed font-light">
          The requested page could not be located. Let's return you to safety.
        </p>
        <div>
          <Link
            to="/"
            className="inline-block px-8 py-3.5 rounded-xl bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/10"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;