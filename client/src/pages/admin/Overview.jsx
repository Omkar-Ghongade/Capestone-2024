import React from 'react';

export default function Overview() {

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch('/api/auth/upload', {
          method: 'POST',
          body: formData
        });
        if (response.ok) {
          console.log('File uploaded successfully');
        } else {
          throw new Error('Failed to upload file');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div className='main-content'>
      <h1>Overview</h1>
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
      />
    </div>
  );
}
