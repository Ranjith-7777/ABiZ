import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-primary-gradient flex items-center justify-center z-50">
      <div className="text-center text-white space-y-8 px-6 animate-fadeIn">
        {/* Logo to be updated after design is finsihed */}
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img 
            src="/assets/bizai-logo.png" 
            alt="BizAI Connect Logo"
            className="h-32 w-auto"
          />
        </div>

        {/* Creators Info */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-semibold text-white/90 mb-6">Your daily news, made simple.</h2>
          
          <div className="grid gap-4 max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <h3 className="font-semibold text-lg">Naga Shiva D</h3>
              <p className="text-white/70 text-sm">Lead Developer</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <h3 className="font-semibold text-lg">Kaushal Reddy S</h3>
              <p className="text-white/70 text-sm">Full-Stack Developer</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <h3 className="font-semibold text-lg">Ranjith Raja B</h3>
              <p className="text-white/70 text-sm">Frontend Developer</p>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="flex items-center justify-center space-x-2 mt-8">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        <p className="text-white/60 text-xs mt-4">Loading your daily briefing...</p>
      </div>
    </div>
  );
}