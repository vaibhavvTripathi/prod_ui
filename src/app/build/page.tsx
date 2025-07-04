"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

const Build = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  return <div>we want to enter the room with id as : {id}</div>;
};

export default Build;
