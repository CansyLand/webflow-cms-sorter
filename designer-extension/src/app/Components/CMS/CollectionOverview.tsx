"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Loads all collections in CMS and dosplays names
 * If you click on a collection name the ID of the
 * collection is sent back to CollectionManager
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface CollectionProp {
  token: string;
  onCollectionSelect: (id: string) => void;
}

const Collection: React.FC<CollectionProp> = ({
  token,
  onCollectionSelect,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [collections, setCollections] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    getCollections();
  }, []); // Empty dependency array ensures this runs once on mount

  const getCollections = async () => {
    const siteInfo = await webflow.getSiteInfo();
    const params = new URLSearchParams({
      auth: token,
      siteId: siteInfo.siteId,
    });

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/collection?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Origin: window.location.origin,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCollections(data.collections);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loader"></div>;
  }

  // sends clicked ID back to CollectionManager
  const handleCollectionClick = (collection: any) => {
    // Call the onCollectionSelect prop with the selected collection ID
    onCollectionSelect(collection);
  };

  return (
    <ul className="w-full">
      {collections.map((collection, index) => (
        <li key={index} className="border-b border-gray-300 py-2">
          <button
            // type="button"
            className="w-full text-left"
            onClick={() => handleCollectionClick(collection)}
          >
            {collection.displayName}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Collection;
