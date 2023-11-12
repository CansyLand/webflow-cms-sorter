import React from "react";

type InitializeCollectionProps = {
  onClick: () => void;
};

const InitializeCollection: React.FC<InitializeCollectionProps> = ({
  onClick,
}) => {
  return (
    <div>
      <div className="fixed top-24 inset-x-0 z-50 flex justify-center items-start m-5">
        <div className="bg-black p-6 rounded-lg shadow-lg text-center border border-white">
          <h2 className="text-xl font-semibold mb-4">Initialize Collection</h2>
          <p className="mb-4">
            This will add a new custom field to your collection that tracks the
            sorting of your items.
          </p>
          <button
            onClick={onClick}
            className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border border-white"
          >
            Initialize
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitializeCollection;
