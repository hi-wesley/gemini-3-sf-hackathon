import React from "react";

const LoadingIndicator = ({ status }) => {
    if (!status) return null;

    return (
        <div className="section loading-container">
            <div className="loading-pulse">
                <div className="pulse-dot"></div>
                <div className="pulse-dot"></div>
                <div className="pulse-dot"></div>
            </div>
            <p className="loading-text">{status}</p>
        </div>
    );
};

export default LoadingIndicator;
