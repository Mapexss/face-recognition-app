import React, { useState } from 'react';

function App() {
    const [selectedFile, setSelectedFile] = useState();

    const handleFileChange = event => {
        setSelectedFile(event.target.files[0]);
    };
  
    const getfiles = () => {
        
  
        fetch('http://localhost:3000/upload', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
            alert('File uploaded successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error!');
        });
    };


  return (
    <div className="App">
        <h1>File Upload</h1>
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={getfiles}>Get Files</button>
        </div>
    </div>
  );
}

export default App;