import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-gradient flex items-center justify-center text-white font-serif font-bold text-sm">
              B
            </div>
            <span className="font-serif text-lg font-bold">
              Biz<span className="text-accent">AI</span>
            </span>
          </div>

          {/* Contact Developers */}
          <div className="text-center md:text-right">
            <p className="text-sm font-semibold text-foreground mb-1">
              Contact Developers
            </p>
            <a 
              href="mailto:teambizai@gmail.com"
              className="text-sm text-accent hover:text-accent/80 hover:underline transition-colors"
            >
              📧 teambizai@gmail.com
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-4"></div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-muted">
          <p>
            © 2026 BizAI. Built with ❤️ by Naga Shiva D, Kaushal Reddy S, and Ranjith Raja B. A joint initiative by ASB and AI 
          </p>
          <p>
            Ethical news consumption • Transparent sources • Go Green
          </p>
        </div>
      </div>
    </footer>
  );
}