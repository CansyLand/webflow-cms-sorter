import { sortCollectionBySortApp } from "./utils";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchCollectionData = async (
  token: string,
  collectionId: string
) => {
  if (!collectionId) {
    throw new Error("Collection ID is required");
  }

  const params = new URLSearchParams({ auth: token, collectionId });
  const response = await fetch(
    `${BACKEND_URL}/api/collection/items?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const { collection, collectionDetails } = await response.json();

  // Check if the collection is initialized
  const isInitialized = collectionDetails.fields.some(
    (field: { slug: string }) => /^sort-app(-\d+)?$/.test(field.slug)
  );

  // Sort items
  const { sortedItems, sortFieldName } = sortCollectionBySortApp(
    collection.items
  );

  return { sortedItems, sortFieldName, isInitialized };
};

export const initializeCollection = async (
  token: string,
  collectionId: string
) => {
  if (!collectionId) {
    throw new Error("Collection ID is required");
  }

  const response = await fetch(`${BACKEND_URL}/api/collection/init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ collectionId, token }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // You can return some data here if needed, or just confirm the operation was successful
  return response.json(); // or just return true;
};

export const updateSortedItem = async (
  collectionId: string,
  itemId: string,
  token: string,
  sortField: string,
  newSortValue: number
) => {
  const response = await fetch(`${BACKEND_URL}/api/collection/update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({
      collectionId,
      itemId,
      token,
      sortField,
      newSortValue,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Handle successful response
  console.log("Item updated successfully");
};
