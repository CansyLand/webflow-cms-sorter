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
        collectionName={
          selectedCollection ? selectedCollection.displayName : ""
        }
      ></HeaderBar>
      <CollectionLayout>{content}</CollectionLayout>
    </motion.div>
  );
};

export default CollectionManager;
