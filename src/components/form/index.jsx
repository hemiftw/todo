import React from 'react';

export const Input = (props) => {
  return (
    <>
      <input {...props} ref={props.ownref} />
    </>
  );
};
  
 
 
  export const Button = (props) => {
    return (
      <>
        <button {...props}  >
          {props.children}
        </button>
      </>
    );
  };
  
  
  