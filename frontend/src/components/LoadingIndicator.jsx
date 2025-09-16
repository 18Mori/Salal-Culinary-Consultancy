import React from "react"

const LoadingIndicator = () => {
    return <div className="loading-container">
        <div className="loader"
        style={{
            border: "5px solid #f3f3f3",
            bordertop: "5px solid #3498db",
            borderradius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 2s linear infinite",
            "@keyframes spin": {
                "0%": {
                    transform: "rotate(0)",
                },
                "100%": {
                    transform: "rotate(360deg)",
                }
            }
        }}></div>
    </div>
}

export default LoadingIndicator