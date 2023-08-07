import "./custom-table-renderer.css";
import React from "react";

const CustomTableRenderer: React.FC = ({ children }) => {
  return <table className='custom-table'>{children}</table>;
};

export default CustomTableRenderer;
