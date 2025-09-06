import React from 'react';

const SvgAnimation = () => {
  const svgContent = `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Light Gray, Thinner Checkmark Path -->
      <path id="tick" d="M20 50 L40 70 L80 30" stroke="#ccc" strokeWidth="8" fill="none" strokeLinecap="round"
        stroke-dasharray="100" stroke-dashoffset="100">
        <animate 
          attributeName="stroke-dashoffset" 
          from="100" to="0" 
          dur="2s" 
          begin="0s" 
          repeatCount="indefinite" />
      </path>
      
      <!-- Animated Blue Square -->
      <rect id="blueSquare" x="-4" y="-4" width="8" height="8" fill="blue">
        <animateTransform 
          attributeName="transform" 
          type="scale" 
          values="1; 1.05; 1" 
          keyTimes="0; 0.5; 1"
          dur="1s" 
          repeatCount="indefinite" />
      </rect>

      <!-- Define smooth motion path animation -->
      <animateMotion xlink:href="#blueSquare" begin="0s" dur="2s" repeatCount="indefinite" rotate="auto">
        <mpath xlink:href="#tick" />    
      </animateMotion>
    </svg>
  `;

  return <div dangerouslySetInnerHTML={{ __html: svgContent }} />;
};

export default SvgAnimation;