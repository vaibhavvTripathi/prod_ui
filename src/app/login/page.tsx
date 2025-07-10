"use client";

import GLBUTTON from "@/components/google-login-button";



const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`;

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      {/* Shimmer keyframes injected */}
      <style>{shimmerKeyframes}</style>
      <div className="relative bg-background/70 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center border border-primary/20 animate-bounce-in">
        {/* Funky Gradient Accent Circle */}
        <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-primary/30 via-pink-300/20 to-yellow-200/20 rounded-full blur-2xl z-0 animate-pulse" />
        {/* Animated, italic, grand title with shimmer, white in dark mode, black in light mode, no underline */}
        <h1
          className="text-5xl font-extrabold italic mb-2 drop-shadow-lg z-10 relative text-black dark:text-white"
          // style={shimmer}
        >
          Codexity
        </h1>
        {/* Funky underline animation keyframes */}
        <style>{`
          @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 2s linear infinite alternate;
          }
          @keyframes bounce-in {
            0% { transform: scale(0.8) translateY(40px); opacity: 0; }
            60% { transform: scale(1.05) translateY(-10px); opacity: 1; }
            100% { transform: scale(1) translateY(0); }
          }
          .animate-bounce-in {
            animation: bounce-in 1s cubic-bezier(.68,-0.55,.27,1.55);
          }
        `}</style>
        <p className="text-base text-muted-foreground mb-8 z-10 animate-fade-in">Sign in to unlock your creative coding experience</p>
        <div className="w-full flex flex-col items-center z-10">
          <GLBUTTON />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
