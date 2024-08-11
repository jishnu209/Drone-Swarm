import React from 'react';
import { Link } from 'react-router-dom';

function InputNumberComponent({ setNumber }) {
  return (
    <div>
      <input type="number" onChange={(e) => setNumber(e.target.value)} placeholder="Enter a number" />
      <button><Link to='maps'>maps</Link></button>
    </div>
  );
}

export default InputNumberComponent;
