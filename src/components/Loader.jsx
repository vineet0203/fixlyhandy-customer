import './Loader.css';

const Loader = ({ fullPage = false }) => (
  <div className={fullPage ? 'loader-fullpage' : 'loader-inline'}>
    <div className="loader-infinity">
      <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
        <path className="loader-path" d="M50,25 C50,25 35,5 20,5 C8,5 0,14 0,25 C0,36 8,45 20,45 C35,45 50,25 50,25 C50,25 65,5 80,5 C92,5 100,14 100,25 C100,36 92,45 80,45 C65,45 50,25 50,25 Z" />
      </svg>
    </div>
  </div>
);

export default Loader;
