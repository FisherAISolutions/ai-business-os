import React from "react";

interface ChecklistItem {
  step: string;
  completed: boolean;
}

interface Props {
  checklist: ChecklistItem[];
}

export const LegalChecklist: React.FC<Props> = ({ checklist }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Legal Checklist</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
        {checklist.map((item, idx) => (
          <li key={idx} className={item.completed ? "line-through text-green-600" : ""}>
            {item.step}
          </li>
        ))}
      </ul>
    </div>
  );
};
