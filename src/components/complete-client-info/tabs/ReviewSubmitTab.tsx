"use client";
import { Check, Edit, AlertCircle } from "lucide-react";

interface ReviewItem {
  title: string;
  content: string;
  onEdit: () => void;
  isComplete: boolean;
  isRequired: boolean;
}

interface ReviewSubmitTabProps {
  items: ReviewItem[];
}

export function ReviewSubmitTab({ items }: ReviewSubmitTabProps) {
  return (
    <div className="space-y-4 w-full">
      {items.map((item, idx) => {
        const showAsIncomplete = !item.isComplete && item.isRequired;
        
        return (
          <div
            key={idx}
            className={`border rounded-lg p-6 flex items-start justify-between gap-4 ${
              showAsIncomplete
                ? 'border-red-300 bg-red-50'
                : 'border-[#d3d3d6] bg-white'
            }`}
          >
            <div className="flex gap-4 flex-1">
              <div className="flex-none pt-1">
                {showAsIncomplete ? (
                  <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={2} />
                ) : (
                  <Check className="w-5 h-5 text-[#0a0a0b]" strokeWidth={3} />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-1 ${
                  showAsIncomplete ? 'text-red-600' : 'text-[#0a0a0b]'
                }`}>
                  {item.title}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  showAsIncomplete ? 'text-red-600' : 'text-[#505056]'
                }`}>
                  {item.content || (showAsIncomplete ? 'This section is incomplete' : 'No content')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={item.onEdit}
              className={`px-4 py-2 rounded-lg font-semibold text-sm flex-none ${
                showAsIncomplete
                  ? 'border-red-300 bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer'
                  : 'border border-[#d3d3d6] hover:bg-[#f4f4f5] cursor-pointer text-[#0a0a0b]'
              }`}
            >
              Edit
            </button>
          </div>
        );
      })}
    </div>
  );
}
