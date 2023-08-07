import React from "react";

const CustomParagraphRenderer: React.FC = ({ children }) => {
  return <p className='custom-paragraph'>{children}</p>;
};

export default CustomParagraphRenderer;
