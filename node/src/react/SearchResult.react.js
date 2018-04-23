'use strict';
import React from 'react';

export default ({imageUrl, name, overview, date}) => (
    <div className="search-result-container">
        <div className="result-image">
            <img src={imageUrl}/>
        </div>
        <div className="result-details">
            <h2>{name}</h2>
            <span className="muted-text">{date}</span>
            <span>{overview}</span>
        </div>
    </div>
);