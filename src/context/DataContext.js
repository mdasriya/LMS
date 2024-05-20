// src/context/DataContext.js
import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [selectedData, setSelectedData] = useState(null);

  return (
    <DataContext.Provider value={{ selectedData, setSelectedData }}>
      {children}
    </DataContext.Provider>
  );
};
