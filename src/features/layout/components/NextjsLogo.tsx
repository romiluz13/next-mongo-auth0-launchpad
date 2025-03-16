import React from 'react';

interface NextjsLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function NextjsLogo({ className = '', width = 80, height = 40 }: NextjsLogoProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 394 80" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M261.919 0.0330722H330.547V12.7H303.323V79.339H289.71V12.7H261.919V0.0330722Z"
        fill="currentColor"
      />
      <path
        d="M149.052 0.0330722V12.7H94.0741V33.0112H138.281V45.6781H94.0741V66.6726H149.052V79.339H80.4607V12.7H80.4607V0.0330722H149.052Z"
        fill="currentColor"
      />
      <path
        d="M183.32 0.0330722V79.339H169.706V0.0330722H183.32Z"
        fill="currentColor"
      />
      <path
        d="M201.112 0.0330722H217.39L254.694 45.1487V0.0330722H268.307V79.339H252.787L214.598 33.0112V79.339H201.112V0.0330722Z"
        fill="currentColor"
      />
      <path
        d="M0 0.0330722H16.2772L58.3125 79.339H43.9221L35.1233 63.0617H18.2353L28.7644 45.6781H38.8163L30.0797 28.9308L12.5334 64.2261H0V0.0330722Z"
        fill="currentColor"
      />
      <path
        d="M333.607 78.8412V0.0330722H348.648L384.668 31.5143L368.803 52.1385L345.688 31.5143L345.733 78.8412H333.607Z"
        fill="currentColor"
      />
      <path
        d="M387.716 0.0330722H394V12.7H387.716V0.0330722Z"
        fill="currentColor"
      />
    </svg>
  );
} 