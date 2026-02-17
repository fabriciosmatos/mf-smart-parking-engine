import React from 'react';

interface FileUploadZoneProps {
  onFileSelect: (file: File | undefined) => void;
  icon: string;
  title: string;
  loadedCount?: number;
  countLabel?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileSelect,
  icon,
  title,
  loadedCount,
  countLabel
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files?.[0]);
  };

  return (
    <div
      className="border-2 border-dashed border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer relative min-h-[160px] sm:min-h-[200px] flex flex-col items-center justify-center"
      onClick={handleClick}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={handleChange}
        accept=".csv"
      />
      <i className={`fa-solid ${icon} text-3xl sm:text-4xl text-indigo-500 mb-3 sm:mb-4`}></i>
      <h3 className="font-bold text-base sm:text-lg">{title}</h3>
      {loadedCount !== undefined && loadedCount > 0 && (
        <p className="mt-3 sm:mt-4 text-emerald-600 font-black text-xs uppercase">
          {loadedCount} {countLabel}
        </p>
      )}
    </div>
  );
};
