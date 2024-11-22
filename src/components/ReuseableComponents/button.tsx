
const buttonStyles = {
  borderRadius: "5px",
  width: "auto", 
  height: "37px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  transition: "border-color 0.3s, box-shadow 0.3s",
  cursor: "pointer",
  outline: "none",
  marginLeft: "10px",
};

const Button = ({ children, outlined, onClick, size = 'md', color = 'black', ...props }) => {
  const sizeMap = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-md',
    lg: 'py-3 px-6 text-lg',
  };

  const defaultClasses = `
    ${outlined ? 'bg-white text-black border border-black' : `bg-${color} text-white`}
    rounded transition-all duration-300 ease-in-out 
    hover:bg-opacity-90
    ${sizeMap[size] || sizeMap.md}  // Default to medium size
  `;

  // Merge the custom styles with the inline styles
  const mergedStyles = {
    ...buttonStyles,
    border: outlined ? '1px solid black' : 'none',
  };

  return (
    <button
      style={mergedStyles}
      className={defaultClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
