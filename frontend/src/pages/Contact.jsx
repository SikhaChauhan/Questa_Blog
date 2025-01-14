import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus(result.message || 'Failed to send message. Please try again later.');
      }
    } catch (error) {
      setStatus('Error sending message. Please try again later.');
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 mt-2 bg-gray-50">
      <h1 className="mb-8 text-4xl font-extrabold text-center text-gray-900">Contact Us</h1>
      <div className="w-full max-w-2xl p-8 overflow-hidden bg-white rounded-lg shadow-xl shadow-black ">
        {/* Centered Contact Form Title */}
        <h2 className="mb-8 text-3xl font-bold text-center text-gray-900">Get in Touch</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your Email"
            />
          </div>
          <div>
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              required
              className="w-full p-3 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your Message"
            ></textarea>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative group">
              <div className="absolute transition duration-500 rounded-lg opacity-75 -inset-1 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 blur group-hover:opacity-100"></div>
              {/* Increased size of the button */}
              <button className="relative px-12 py-3 text-lg font-bold text-white bg-black rounded-lg" type="submit">Send Mail</button>
            </div>
          </div>
          {status && <p className="mt-4 text-center">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default Contact;
