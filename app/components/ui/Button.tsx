import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}) => {
  const baseStyles = "px-12 py-4 rounded-2xl font-black uppercase tracking-widest transition-all";
  
  const variantStyles = {
    primary: "bg-slate-900 text-white disabled:opacity-30",
    secondary: "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-105",
    ghost: "text-slate-400 hover:text-slate-900"
  };

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
