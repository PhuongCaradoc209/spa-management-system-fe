import heroImg from "./assets/hero.png";

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">Welcome to ISM Frontend</h1>
        <p className="text-lg text-gray-600 mb-8">
          This is a React application built with Vite and Tailwind CSS.
        </p>
        <img
          src={heroImg}
          alt="Hero"
          className="w-full max-w-md rounded-lg shadow-lg"
        />
      </div>
    </>
  );
}

export default App;
