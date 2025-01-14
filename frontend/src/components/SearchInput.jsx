// src/components/SearchInput.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchInput() {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (inputValue.trim() === '') {
        navigate('/search');
      } else {
        navigate(`/search?searchTerm=${inputValue}`);
      }
    }
  };

  return (
    <input
      type='text'
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyPress}
      placeholder='Search...'
      className='p-2 border rounded'
    />
  );
}
