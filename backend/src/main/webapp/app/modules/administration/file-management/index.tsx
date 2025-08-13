import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FileManagementInterface from './file-management-interface';

const FileManagementRoutes = () => (
  <Routes>
    <Route path="/" element={<FileManagementInterface />} />
  </Routes>
);

export default FileManagementRoutes;
