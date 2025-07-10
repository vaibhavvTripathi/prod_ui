import React from "react";
import BuilderSection from "@/components/builder-section";
import { AuthBoundary } from "@/components/auth-boundary";

const BuilderPage = () => {
  return (
    <AuthBoundary>
      <BuilderSection />
    </AuthBoundary>
  );
};

export default BuilderPage;
