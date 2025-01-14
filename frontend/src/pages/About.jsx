import React from 'react';

const About = () => {
  return (
    <div className="relative px-6 py-16 overflow-hidden bg-gray-100 lg:px-8">
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <svg
          className="relative left-[calc(100%-13rem)] -z-10 max-w-none -translate-x-1/2 rotate-[30deg] -translate-y-8 fill-[#f2f4f7]"
          viewBox="0 0 1155 678"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="url(#a)"
            fillOpacity=".3"
            d="M317.021 532.161C405.318 565.629 496.21 584 588.542 584c193.92 0 351.458-78.265 351.458-174.458 0-80.185-37.946-147.94-100.953-187.585C697.758 130.205 578.573 0 459.416 0 174.678 0 0 182.488 0 407.853c0 97.883 102.547 189.418 246.667 261.329 14.651 7.292 31.453 13.865 49.839 20.656z"
          />
          <defs>
            <linearGradient id="a" x1="0" x2="1" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#9089FC" />
              <stop offset="100%" stopColor="#FF80B5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="relative max-w-3xl mx-auto text-center">
        <h1 className="mb-6 text-5xl font-extrabold text-gray-900">About Us</h1>
        <p className="mb-6 text-lg text-gray-700">
          Welcome to our blog! We’re delighted to have you here. This is a space where we share our passion for writing about a wide range of topics. Whether you're looking for insightful articles, engaging stories, or tips and tricks on various subjects, you’ve come to the right place.
        </p>
        <p className="mb-6 text-lg text-gray-700">
          Our blog is designed to be a place of inspiration and information. We cover a variety of topics that interest us, and we hope they’ll interest you as well. From personal experiences to professional insights, our goal is to provide valuable content that keeps you coming back for more.
        </p>
        <h2 className="mb-4 text-3xl font-semibold text-gray-800">Get Involved</h2>
        <p className="mb-6 text-lg text-gray-700">
          We love hearing from our readers! Feel free to leave comments on our posts, share your thoughts, or get in touch with us if you have any questions or suggestions. Your feedback helps us grow and improve.
        </p>
        {/* <Link to="/" className="inline-block px-6 py-3 text-white transition-colors rounded-lg shadow-lg bg-gradient-to-br from-black via-gray-900 to-gray-700 hover:bg-blue-700">
          Back to Home
        </Link> */}
      </div>
    </div>
  );
};

export default About;
