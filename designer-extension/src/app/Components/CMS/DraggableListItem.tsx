import React from "react";
import { Draggable } from "react-beautiful-dnd";

interface DraggableListItemProps {
  item: {
    id: string;
    fieldData: {
      name: string;
    };
  };
  index: number;
  loading: boolean;
}

const DraggableListItem: React.FC<DraggableListItemProps> = ({
  item,
  index,
  loading,
}) => {
  // Add a conditional class for opacity
  const itemClass = loading ? "opacity-50" : "opacity-100";

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`draggable-item border-b border-gray-300 h-12 flex align-center ${itemClass}`}
        >
          <span className="drag-handle">☰</span>
          <h3>{item.fieldData.name}</h3>
        </li>
      )}
    </Draggable>
  );
};

export default DraggableListItem;
