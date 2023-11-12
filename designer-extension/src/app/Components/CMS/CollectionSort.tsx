"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import Loader from "../Helper/Loader";
import ErrorMessage from "../Helper/ErrorMessage";
import InitializeCollection from "./InitializeCollection";
import DraggableListItem from "./DraggableListItem";
import {
  fetchCollectionData,
  initializeCollection,
  updateSortedItem,
} from "./api";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface CollectionSortProps {
  token: string;
  collectionId: string | null;
}

const CollectionSort: React.FC<CollectionSortProps> = ({
  token,
  collectionId,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [collectionData, setCollectionData] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!collectionId) return;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { sortedItems, sortFieldName, isInitialized } =
          await fetchCollectionData(token, collectionId);
        setCollectionData(sortedItems);
        setSortField(sortFieldName);
        setIsInitialized(isInitialized);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [collectionId, token]);

  const handleInitializeClick = async () => {
    if (!collectionId) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      await initializeCollection(token, collectionId);
      // Reload component data
      const { sortedItems, sortFieldName, isInitialized } =
        await fetchCollectionData(token, collectionId);
      setSortField(sortFieldName);
      setCollectionData(sortedItems);
      setIsInitialized(isInitialized);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to initialize collection.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || !sortField || !collectionId) {
      return;
    }

    const items = Array.from(collectionData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    let newSortValue;

    if (result.destination.index === 0) {
      // Moved to the first place
      const highestSortValue = Math.max(
        ...items.map((item) => item.fieldData[sortField] || 0)
      );
      newSortValue = highestSortValue + 1000;
    } else if (result.destination.index === items.length - 1) {
      // Moved to the last place
      const lowestSortValue = Math.min(
        ...items.map((item) => item.fieldData[sortField] || 0)
      );
      newSortValue = lowestSortValue - 1000;
    } else {
      // For other positions
      const newIndex = result.destination.index;
      const prevSortValue =
        newIndex > 0 ? items[newIndex - 1].fieldData[sortField] || 0 : 0;
      const nextSortValue =
        newIndex < items.length - 1
          ? items[newIndex + 1].fieldData[sortField] || 0
          : prevSortValue + 2000;
      newSortValue = (prevSortValue + nextSortValue) / 2;
    }

    // Update the sort value in the local state immediately
    reorderedItem.fieldData[sortField] = newSortValue;
    setCollectionData(items);

    // Set the loading state for the item being updated
    setLoadingItems(new Set(loadingItems.add(reorderedItem.id)));

    // Update the backend
    try {
      await updateSortedItem(
        collectionId,
        reorderedItem.id,
        token,
        sortField,
        newSortValue
      );
    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      // Remove the loading state for the item
      const updatedLoadingItems = new Set(loadingItems);
      updatedLoadingItems.delete(reorderedItem.id);
      setLoadingItems(updatedLoadingItems);
    }
  };

  if (isLoading) return <Loader />;
  if (errorMessage) return <ErrorMessage message={errorMessage} />;
  if (!isInitialized)
    return <InitializeCollection onClick={handleInitializeClick} />;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="w-full"
          >
            {collectionData.map((item, index) => (
              <DraggableListItem
                key={item.id}
                item={item}
                index={index}
                loading={loadingItems.has(item.id)}
              />
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CollectionSort;
