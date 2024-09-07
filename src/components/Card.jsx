import React from 'react';
import '../css/Card.css';

const Card = ({ children, style }) => {
    return (
        <div className="card" style={style}>
            {children}
        </div>
    );
};

export default Card;
