"use client";
import React, { useEffect, useState } from "react";
import { useTemplateQuery } from "@/hooks/useTemplateQuery";
import { useWebcontainer } from "@/hooks/useWebcontainer";
import { PreviewFrame } from "@/components/preview-frame";
import { convertFileItemArrayToFileSystemTree } from "@/helper/createmountstructure";

const Index = () => {
  const { data } = useTemplateQuery();
  const { webcontainer } = useWebcontainer();
  const [isready, setisready] = useState<boolean>(false);
  useEffect(() => {
    if (!data) return;
    const mountingStructure =
      convertFileItemArrayToFileSystemTree(data)["test"]["directory"];
    console.log(
      mountingStructure,
      "----------------------------------------------------"
    );
    if (!mountingStructure) return;
    webcontainer?.mount(mountingStructure);
    setisready(true);
  }, [data, webcontainer]);
  return (
    <>
      <div>
        {isready && webcontainer && (
          <PreviewFrame webContainer={webcontainer} />
        )}
      </div>
    </>
  );
};

export default Index;
