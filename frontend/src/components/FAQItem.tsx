import React, { useState } from "react";
import { FAQItemProps } from "../types/welcome.page.index.type";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-5">
      <button
        type="button"
        className="flex w-full justify-between items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-lg font-medium text-gray-900 text-left">
          {question}
        </h4>
        <span className="ml-6 flex-shrink-0 text-blue-600">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      {isOpen && (
        <div className="mt-3 pr-12">
          <p className="text-base text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQItem;
