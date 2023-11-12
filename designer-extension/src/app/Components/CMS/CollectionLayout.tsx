"use client";

import React, { ReactNode } from "react";

interface CollectionLayoutProps {
  children: ReactNode;
}

const CollectionLayout: React.FC<CollectionLayoutProps> = ({ children }) => {
  return (
    <div className="pt-4 px-5 flex justify-center items-center">{children}</div>
  );
};

export default CollectionLayout;
