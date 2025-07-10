"use client";
import React from "react";
import UserMenu from "@/components/user-menu";

const Navbar: React.FC = () => {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-md border-b border-border shadow-lg">
      <div className="text-3xl font-extrabold italic text-primary tracking-tight select-none">
        Codexity
      </div>
      <div className="flex items-center gap-6">
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
