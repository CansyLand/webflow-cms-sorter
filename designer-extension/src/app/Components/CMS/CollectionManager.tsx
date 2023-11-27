import React, { useState } from "react";
import CollectionOverview from "./CollectionOverview";
import { motion } from "framer-motion";
import CollectionSort from "./CollectionSort";
import CollectionLayout from "./CollectionLayout";
import HeaderBar from "./HeaderBar";

interface CollectionProp {
  token: string;
}

type Collection = {
  createdOn: string;
  displayName: string;
  id: string;
  lastUpdated: string;
  singularName: string;
  slug: string;
};

type CollectionsResponse = {
  collections: Collection[];
};

const CollectionManager: React.FC<CollectionProp> = ({ token }) => {
  const [page, setPage] = useState("collection-overview");
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  const handleCollectionSelect = (collection: any) => {
    if (collection == null) return;
    setSelectedCollection(collection);
    setPage("collection-sort");
  };

  const collectionName = selectedCollection
    ? selectedCollection.displayName
    : "";

  let content;
  switch (page) {
    case "collection-overview":
      content = (
        <CollectionOverview
          token={token}
          onCollectionSelect={handleCollectionSelect}
        />
      );
      break;
    case "collection-sort":
      if (!selectedCollection) {
        break;
      }
      content = (
        <CollectionSort token={token} collectionId={selectedCollection.id} />
      );
      break;
    default:
      content = <div>Default Content</div>;
  }

  const handleDisconnect = () => {
    localStorage.removeItem("devflow_token");
  };

  return (
    <motion.div
      className=""
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {" "}
      <HeaderBar
        page={page}
        setPage={setPage}
        collectionName={collectionName}
      ></HeaderBar>
      <CollectionLayout>{content}</CollectionLayout>
      {collectionName === "" && (
        <div className="flex justify-center mt-4 mb-4">
          <button
            className="bg-black text-white border border-white py-2 px-4 mt-12 rounded hover:bg-red-700 transition duration-300"
            onClick={handleDisconnect}
          >
            Disconnect App
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CollectionManager;
