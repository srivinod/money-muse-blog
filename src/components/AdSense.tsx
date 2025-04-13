
import React from 'react';

interface AdSenseProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
}

const AdSense: React.FC<AdSenseProps> = ({
  slot = '1234567890',
  format = 'auto',
  responsive = true,
  className,
}) => {
  return (
    <div className={`ad-container my-6 ${className || ''}`}>
      <div 
        className="bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm"
        style={{ 
          minHeight: '300px', // Increased from 250px to 300px
          width: '100%',
          overflow: 'hidden',
          transform: 'translateY(-1px)' // Moved up by 1px
        }}
      >
        <div className="text-center p-4">
          <p className="mb-2 font-semibold">ADVERTISEMENT</p>
          <p className="text-xs">
            Dummy AdSense Ad (slot: {slot}, format: {format})
          </p>
          <p className="text-xs mt-1 text-gray-400">
            In production, replace with actual Google AdSense code
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdSense;
