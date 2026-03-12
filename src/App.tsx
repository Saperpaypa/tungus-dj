/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, animate } from 'motion/react';
import { ExternalLink, Phone, Instagram, Send, Facebook, ArrowRight, Play, Volume2, Menu, X, Pause, Download } from 'lucide-react';
import { content } from './content';

const IconMap: Record<string, React.ReactNode> = {
  "Instagram": <Instagram className="w-4 h-4" />,
  "Telegram": <Send className="w-4 h-4" />,
  "Facebook": <Facebook className="w-4 h-4" />,
  "default": <Phone className="w-4 h-4" />
};

const TungusHover = ({ className, showDot = false }: { className?: string, showDot?: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const letters = [
    { en: 'T', ru: 'Т' },
    { en: 'U', ru: 'У' },
    { en: 'N', ru: 'Н' },
    { en: 'G', ru: 'Г' },
    { en: 'U', ru: 'У' },
    { en: 'S', ru: 'С' },
  ];

  return (
    <span 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-flex cursor-default ${className}`}
    >
      {letters.map((char, i) => (
        <span 
          key={i}
          className="relative inline-flex items-center justify-center"
          style={{ width: '0.75em' }} 
        >
          <span 
            className={`transition-all duration-500 transform ${
              isHovered ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
            } text-brand`}
          >
            {char.en}
          </span>
          <span 
            className={`absolute transition-all duration-500 transform ${
              isHovered ? 'opacity-100 scale-100 text-[#ff0000]' : 'opacity-0 scale-90'
            }`}
          >
            {char.ru}
          </span>
        </span>
      ))}
      {showDot && <span className="text-white">.PRESS</span>}
    </span>
  );
};

const Equalizer = () => (
  <span className="inline-flex items-end gap-[3px] h-5 ml-2">
    {[0.4, 0.7, 1, 0.6, 0.85].map((h, i) => (
      <motion.span
        key={i}
        className="w-[3px] bg-brand rounded-full"
        animate={{ scaleY: [h, 1, 0.3, h] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
        style={{ height: '100%', transformOrigin: 'bottom' }}
      />
    ))}
  </span>
);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [swipeDir, setSwipeDir] = useState(1);
  const dragX = useMotionValue(0);
  const dragRotate = useTransform(dragX, [-250, 250], [-18, 18]);

  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIdx]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const lightboxGallery = content.gallery.filter((_, i) => i !== content.gallery.length - 1);
  const lightboxImg = lightboxIdx !== null ? lightboxGallery[lightboxIdx] : null;

  const lightboxPrev = () => { setSwipeDir(-1); setLightboxIdx(i => i !== null ? (i - 1 + lightboxGallery.length) % lightboxGallery.length : null); };
  const lightboxNext = () => { setSwipeDir(1); setLightboxIdx(i => i !== null ? (i + 1) % lightboxGallery.length : null); };
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 100], ["rgba(5, 5, 5, 0)", "rgba(5, 5, 5, 0.8)"]);
  const navBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-hidden">
      <div className="noise" />
      
      {/* Navigation */}
      <motion.nav 
        style={{ backgroundColor: navBg, backdropFilter: navBlur }}
        className="fixed top-0 left-0 right-0 z-50 py-6 border-b border-white/5 transition-all duration-300"
      >
        <div className="container-custom flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-display font-bold tracking-tighter"
          >
            <TungusHover showDot />
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {['Обо мне', 'Достижения', 'Галерея', 'Лайв'].map((item, idx) => {
              const links = ['about', 'achievements', 'gallery', 'live'];
              return (
                <a 
                  key={item} 
                  href={`#${links[idx]}`} 
                  className="text-xs uppercase tracking-widest font-bold text-white/60 hover:text-brand transition-colors"
                >
                  {item}
                </a>
              );
            })}
            <a href={content.hero.contacts[0].url} className="btn-premium !py-2 !px-6 text-xs">
              Забронировать
            </a>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#050505] pt-32 px-6 md:hidden"
          >
            <div className="flex flex-col gap-8 text-4xl font-display font-bold">
              {['Обо мне', 'Достижения', 'Галерея', 'Лайв'].map((item, idx) => {
                const links = ['about', 'achievements', 'gallery', 'live'];
                return (
                  <a key={item} href={`#${links[idx]}`} onClick={() => setIsMenuOpen(false)}>
                    {item}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-64 md:pb-40">
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-16 xl:gap-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              style={{ y: useTransform(scrollY, [0, 400], [0, -60]) }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full md:w-[260px] lg:w-[320px] xl:w-[400px] flex-shrink-0"
            >
              <div className="relative group/image">
                <div className={`absolute -inset-32 transition-opacity duration-1000 pointer-events-none ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover/image:opacity-100'}`}>
                  <div className={`absolute inset-0 rounded-full ${isPlaying ? 'aurora-glow' : 'bg-brand/20 blur-3xl'}`} />
                </div>
                
                <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/5] border border-white/10 z-10">
                  <img 
                    src={content.hero.image} 
                    alt={content.hero.name}
                    className={`w-full h-full object-cover transition-all duration-1000 scale-100 group-hover/image:scale-110 ${isPlaying ? 'grayscale-0' : 'grayscale hover:grayscale-0'}`}
                    referrerPolicy="no-referrer"
                  />
                  <audio 
                    ref={audioRef} 
                    src={content.hero.featuredAudio} 
                    type="audio/mpeg"
                    onEnded={() => setIsPlaying(false)}
                    onError={() => {
                      console.error("Audio error: Failed to load audio file");
                      setIsPlaying(false);
                      alert("Ошибка: Аудиофайл не найден или пуст. Убедитесь, что вы именно ЗАГРУЗИЛИ (Upload) MP3-файл в папку 'public', а не просто создали пустой файл с таким названием.");
                    }}
                  />
                </div>
              </div>
              
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => {
                  if (audioRef.current) {
                    if (isPlaying) {
                      audioRef.current.pause();
                    } else {
                      audioRef.current.play();
                    }
                    setIsPlaying(!isPlaying);
                  }
                }}
                className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-brand p-4 md:p-6 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-20"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Volume2 className="w-8 h-8 text-white animate-pulse" />
                )}
              </motion.button>
            </motion.div>

            <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full md:w-fit flex flex-col items-center md:items-start"
              >
                <h1 className="text-[16vw] sm:text-7xl md:text-6xl lg:text-8xl xl:text-[10rem] 2xl:text-[12rem] font-display font-bold leading-none tracking-tighter flex justify-center md:justify-start mb-8">
                  <TungusHover />
                </h1>
                <h2 className="text-[3vw] sm:text-sm md:text-sm lg:text-base xl:text-xl font-sans text-white/80 mb-12 uppercase font-medium text-center md:text-justify-last w-full tracking-normal">
                  {content.hero.role}
                </h2>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {content.hero.contacts.map((contact, idx) => (
                    <motion.a 
                      key={idx} 
                      href={contact.url} 
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-secondary flex items-center gap-3"
                    >
                      {IconMap[contact.label] || IconMap.default}
                      <span className="text-xs font-bold uppercase tracking-widest">{contact.label}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none select-none overflow-hidden opacity-[0.03] -z-10">
          <h2 className="text-[30vw] font-display font-bold whitespace-nowrap leading-none text-brand">
            TUNGUS TUNGUS TUNGUS
          </h2>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="pt-24 pb-32 bg-white text-black rounded-[3rem] md:rounded-[5rem] relative z-20">
        <div className="container-custom">
          <div className="flex flex-col gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl font-light leading-relaxed text-zinc-600 text-justify"
            >
              <span className="text-brand">TUNGUS</span>
              {content.about.text.replace('TUNGUS', '')}
            </motion.div>

            <div className="flex flex-col md:flex-row gap-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl flex-1"
              >
                <img
                  src={content.photos[1]}
                  alt="Tungus in action"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl flex-1"
              >
                <img
                  src={content.photos[0]}
                  alt="Tungus portrait"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-24">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="text-sm font-bold uppercase tracking-[0.5em] text-brand mb-6">ХАЙЛАЙТС</h2>
            <h3 className="text-5xl md:text-8xl font-display font-bold tracking-tighter uppercase">
              ДОСТИЖЕНИЯ
            </h3>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
            {content.achievements.items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="glass-card p-8 group flex-none w-[78vw] md:w-auto snap-center"
              >
                <div className="relative w-full aspect-square mb-10 overflow-hidden rounded-2xl">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className={`w-full h-full object-cover md:grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ${idx === 2 ? 'object-top' : 'object-center'}`}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-brand transition-colors">{item.title}</h4>
                <p className="text-zinc-500 group-hover:text-white leading-relaxed font-light transition-colors duration-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section - Bento Grid */}
      <section id="gallery" className="py-24 bg-zinc-900/30">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-end mb-12 gap-8">
            <div className="max-w-xl">
              <h2 className="text-sm font-bold uppercase tracking-[0.5em] text-brand mb-6">Визуал</h2>
              <h3 className="text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase">Галерея</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {content.gallery.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative overflow-hidden rounded-3xl group cursor-pointer ${
                  idx === 0 ? 'md:col-span-2 md:row-span-2' : ''
                } ${idx === content.gallery.length - 1 ? 'hidden md:block' : ''}`}
                onClick={() => idx !== content.gallery.length - 1 && setLightboxIdx(idx)}
              >
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover md:grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:flex items-end justify-center pb-6">
                  <a
                    href={img}
                    download
                    className="flex items-center gap-2 bg-white text-black text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-full hover:bg-brand hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="w-4 h-4" />
                    Скачать
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Section */}
      <section id="live" className="py-24">
        <div className="container-custom">
          <div className="mb-12 text-right">
            <h2 className="text-sm font-bold uppercase tracking-[0.5em] text-brand mb-6">КОНТЕНТ</h2>
            <h3 className="text-5xl md:text-8xl font-display font-bold tracking-tighter uppercase flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
              <TungusHover /> Live
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {content.live.items.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="relative aspect-video overflow-hidden rounded-[2.5rem] mb-6 border border-white/10">
                  {playingIdx === idx && item.embedUrl ? (
                    <iframe
                      src={item.embedUrl}
                      className="w-full h-full"
                      allow="autoplay"
                    />
                  ) : (
                    <>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover md:grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                        style={idx === 1 ? { objectPosition: 'center 20%' } : undefined}
                        referrerPolicy="no-referrer"
                      />
                      <div
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer"
                        onClick={() => item.embedUrl && setPlayingIdx(idx)}
                      >
                        <div className="w-20 h-20 bg-brand rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                          <Play className="w-8 h-8 text-white fill-current" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-between items-start gap-8">
                  <div>
                    <h4 className="text-3xl font-bold mb-4 tracking-tight group-hover:text-brand transition-colors flex items-center">
                      {item.title}
                      {playingIdx === idx && <Equalizer />}
                    </h4>
                    <p className="text-zinc-500 font-light leading-relaxed mb-8">{item.description}</p>
                    <a 
                      href={item.url} 
                      className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white hover:text-brand transition-colors group/link"
                    >
                      {item.buttonText} 
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-4xl font-display font-bold tracking-tighter">
              <span className="text-white">TUNGUS</span>
              <span className="text-brand">DJ</span>
              <span className="text-white">.RU</span>
            </div>

            <div className="flex gap-6">
              {content.hero.contacts.slice(1).map((contact, idx) => (
                <a
                  key={idx}
                  href={contact.url}
                  className="text-zinc-500 hover:text-brand transition-colors"
                >
                  {IconMap[contact.label]}
                </a>
              ))}
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-bold">
                © 2026 ALL RIGHTS RESERVED
              </div>
              <div className="text-white text-[10px] uppercase tracking-[0.3em] font-bold">
                PROD BY TUNGUS
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxIdx(null)}
          >
            <AnimatePresence mode="wait" custom={swipeDir} onExitComplete={() => dragX.set(0)}>
              <motion.img
                key={lightboxIdx}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                style={{ x: dragX, rotate: dragRotate }}
                initial={{ opacity: 0, x: swipeDir * 300 }}
                animate={{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
                exit={{ opacity: 0, x: swipeDir * -350, rotate: swipeDir * -15, transition: { duration: 0.25 } }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) lightboxNext();
                  else if (info.offset.x > 80) lightboxPrev();
                  else animate(dragX, 0, { type: 'spring', stiffness: 500, damping: 35 });
                }}
                src={lightboxImg}
                className="max-w-full max-h-full object-contain rounded-2xl cursor-grab active:cursor-grabbing select-none"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>
            <button
              className="absolute top-5 right-5 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
              onClick={() => setLightboxIdx(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <a
              href={lightboxImg}
              download
              className="absolute bottom-5 right-5 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="w-6 h-6" />
            </a>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-xs">
              {lightboxIdx + 1} / {lightboxGallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
