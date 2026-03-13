import { motion } from 'motion/react';

interface PioneerPlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  className?: string;
}

export default function PioneerPlayButton({ isPlaying, onClick, className = '' }: PioneerPlayButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className={`w-[112px] h-[112px] md:w-[132px] md:h-[132px] rounded-full ${className}`}
      aria-label={isPlaying ? 'Пауза' : 'Играть'}
      style={{
        boxShadow: isPlaying
          ? '0 0 0 2px #00ff41, 0 0 14px 6px rgba(0,255,65,0.5), 0 10px 30px rgba(0,0,0,0.85)'
          : '0 0 0 1px rgba(255,255,255,0.06), 0 10px 28px rgba(0,0,0,0.8)',
        transition: 'box-shadow 0.35s ease',
      }}
    >
      <img
        src="/pioneer-button.png"
        alt=""
        className="w-full h-full rounded-full object-cover"
        style={{
          filter: isPlaying ? 'none' : 'saturate(0.15) brightness(0.7)',
          transition: 'filter 0.35s ease',
        }}
      />
    </motion.button>
  );
}
