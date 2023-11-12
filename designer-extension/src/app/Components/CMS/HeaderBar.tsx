"use client";

import React from "react";

interface CollectionHeader {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  collectionName: string | null;
}

const HeaderBar: React.FC<CollectionHeader> = ({
  page,
  setPage,
  collectionName,
}) => {
  const handleBackButtonClick = () => {
    setPage("collection-overview");
  };

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between p-4 text-white bg-black border-b border-gray-300">
      {page === "collection-sort" && (
        <button onClick={handleBackButtonClick} className="mr-4">
          {/* SVG arrow back */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      <h1 className="text-base font-semibold flex-1 text-center">
        {page === "collection-sort" ? collectionName : "CMS"}
      </h1>

      {/* This is a placeholder to balance the layout */}
      {page === "collection-sort" && (
        <div className="h-6 w-6 mr-4 invisible"></div>
      )}
    </div>
  );
};

export default HeaderBar;
