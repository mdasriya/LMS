import React, { createContext, useContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [constructionData, setConstructionData] = useState({
    contractor: "",
    amount: 0,
  });

  const [projectData, setProjectData] = useState({
    plotNo: "",
    projectName: "",
    blockName: "",
  });

  const [brokerName, setBrokerName] = useState("");

  return (
    <DataContext.Provider
      value={{
        constructionData,
        setConstructionData,
        projectData,
        setProjectData,
        brokerName,
        setBrokerName,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
