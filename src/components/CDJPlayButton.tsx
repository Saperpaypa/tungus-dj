import React, { useState } from 'react';

interface CdjPlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  className?: string;
}

const CdjPlayButton: React.FC<CdjPlayButtonProps> = ({ isPlaying, onClick, className = '' }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = () => setIsPressed(true);
  const handlePointerUp = () => {
    setIsPressed(false);
    onClick();
  };
  const handlePointerLeave = () => setIsPressed(false);

  // Vinyl micro-groove texture
  const vinylTexture = `repeating-radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0px, rgba(0,0,0,0.18) 0.3px, rgba(0,0,0,0) 0.6px)`;

  // Spun aluminum — bevel (shifted 20deg for light refraction)
  const bevelAnthracite = '#0a0c0e';
  const bevelMid = '#15181b';
  const bevelSteel = '#8a96a3';
  const bevelMetalColors = `
    ${bevelAnthracite} 0deg, ${bevelMid} 15deg, ${bevelSteel} 45deg, ${bevelMid} 75deg,
    ${bevelAnthracite} 90deg, ${bevelMid} 105deg, ${bevelSteel} 135deg, ${bevelMid} 165deg,
    ${bevelAnthracite} 180deg, ${bevelMid} 195deg, ${bevelSteel} 225deg, ${bevelMid} 255deg,
    ${bevelAnthracite} 270deg, ${bevelMid} 285deg, ${bevelSteel} 315deg, ${bevelMid} 345deg,
    ${bevelAnthracite} 360deg
  `;
  const bevelConicGradient = `conic-gradient(from 20deg at 50% 50%, ${bevelMetalColors})`;

  const containerStyle: React.CSSProperties = {
    width: '112px',
    height: '112px',
    borderRadius: '50%',
    transform: isPressed ? 'scale(0.97)' : 'scale(1)',
    transition: 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    background: 'none',
    border: 'none',
    padding: 0,
    outline: 'none',
  };

  // Level 1: Outer acrylic LED ring (112x112)
  const ledRingStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: isPlaying ? '#00ff41' : '#012108',
    boxShadow: isPlaying
      ? '0 0 16px 4px rgba(0,255,65,0.5), inset 0 0 8px 1px #00ff41, inset 0 1px 2px rgba(255,255,255,0.4)'
      : 'inset 0 -1px 4px rgba(0,0,0,0.9), inset 0 1px 2px rgba(255,255,255,0.1), 0 4px 6px rgba(0,0,0,0.6)',
    transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
  };

  // Level 2: Bevel (108x108, offset 2px inside ledRing)
  const bevelStyle: React.CSSProperties = {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '108px',
    height: '108px',
    borderRadius: '50%',
    background: `${vinylTexture}, ${bevelConicGradient}`,
    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.15), inset 0 -1px 3px rgba(0,0,0,0.8), 0 0 3px rgba(0,0,0,0.6)',
  };

  // Level 3: Main flat disk (96x96, offset 6px inside bevel)
  const mainDiskStyle: React.CSSProperties = {
    position: 'absolute',
    top: '6px',
    left: '6px',
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.2)',
    overflow: 'hidden',
  };

  // Green glow reflection on metal when playing
  const greenGlowOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 50% 50%, rgba(0,255,65,0.12) 0%, rgba(0,255,65,0.03) 50%, transparent 80%)',
    opacity: isPlaying ? 1 : 0,
    transition: 'opacity 0.15s ease',
    pointerEvents: 'none',
  };

  return (
    <button
      className={className}
      style={containerStyle}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      aria-label={isPlaying ? 'Пауза' : 'Играть'}
    >
      <div style={ledRingStyle}>
        <div style={bevelStyle}>
          <div style={mainDiskStyle}>
            <img
              src="/pioneer-button.png"
              alt=""
              style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%', objectFit: 'contain', transform: 'translate(-50%, -50%) scale(2)', transformOrigin: 'center', pointerEvents: 'none' }}
            />

            <div style={greenGlowOverlayStyle} />
          </div>
        </div>
      </div>
    </button>
  );
};

export default CdjPlayButton;
