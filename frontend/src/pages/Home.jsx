import React from 'react';

const HomePage = () => {
  return (
    <div className="relative h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 object-cover w-full h-full"
      >
        <source src="/assets/174004-850361301_small.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 flex items-center justify-center h-full bg-black bg-opacity-50">
        <h1 className="text-4xl font-bold text-white md:text-6xl">
          Welcome to The World of Blogs
        </h1>
      </div>
    </div>
  );
};

export default HomePage;
