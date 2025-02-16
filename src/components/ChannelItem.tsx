import React from "react";
import { CheckSquare, Square } from "lucide-react";
import type { Channel } from "../types";

interface ChannelItemProps {
  channel: Channel;
  isSelected: boolean;
  onToggle: (channelId: string) => void;
}

export const ChannelItem: React.FC<ChannelItemProps> = ({
  channel,
  isSelected,
  onToggle,
}) => {
  return (
    <div
      className={`bg-gray-800 rounded-lg p-4 hover:bg-gray-600 transition duration-200 ease-in-out cursor-pointer ${
        isSelected ? "ring-2 ring-gray-300" : ""
      }`}
      onClick={() => onToggle(channel.id)}
    >
      <div className="flex items-center mb-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(channel.id);
          }}
          className="mr-2 text-gray-300 focus:outline-none"
        >
          {isSelected ? (
            <CheckSquare className="w-5 h-5" />
          ) : (
            <Square className="w-5 h-5" />
          )}
        </button>
        <span className="font-semibold text-white">{channel.name}</span>
      </div>
      {channel.logo && (
        <img
          src={channel.logo || "/placeholder.svg"}
          alt={channel.name}
          className="w-16 h-16 object-contain mb-2 rounded-md"
        />
      )}
    </div>
  );
};
