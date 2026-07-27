import { Link } from "react-router-dom";
import { FiCompass } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface bg-grid-pattern bg-grid flex flex-col items-center justify-center px-4 text-center">
      <FiCompass className="text-primary-500 mb-4" size={40} />
      <h1 className="text-5xl font-display font-bold text-slate-100">404</h1>
      <p className="text-slate-400 mt-3 max-w-sm">
        This coordinate doesn't map to anything in GeoMiner AI. Let's get you back to known ground.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Return home
      </Link>
    </div>
  );
}
