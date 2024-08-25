"use client"
import { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

export default function Home() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState({});

  const handleSubmit = async () => {
    try {
      setError('');
      const parsedData = JSON.parse(jsonInput);
      if (!Array.isArray(parsedData.data)) {
        throw new Error("Invalid input format. 'data' should be a list.");
      }
      const response = await axios.post('http://127.0.0.1:5000/bfhl', {
        data: parsedData.data
      });
      setResponseData(response.data);
      setFilteredResponse({});
    } catch (err) {
      setError('Invalid JSON input or server error');
      console.error(err);
    }
  };

  const handleFilterChange = (selected) => {
    setSelectedOptions(selected);
    const filtered = {};
    selected.forEach(option => {
      filtered[option.value] = responseData[option.value];
    });
    setFilteredResponse(filtered);
  };

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' }
  ];

  return (
    <div className=' mx-auto w-1/2 gap-3 flex flex-col m-5'>
      <h1>API INPUT</h1>
      <textarea
        id = "api_input"
        rows="4"
        cols="50"
        placeholder='Enter JSON: { "data": ["A", "1", "b", "2"] }'
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        className='border p-3 rounded-md'
      />
      <br/>
      <button onClick={handleSubmit} className='bg-blue-600 rounded-md p-3 text-white'>Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <br/>
      {Object.keys(responseData).length > 0 && (
        <>
          <Select
            isMulti
            options={options}
            onChange={handleFilterChange}
            placeholder="Select filters..."
          />
          <br/>
          <div>
            <h3>Filtered Response</h3>
            <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
}
