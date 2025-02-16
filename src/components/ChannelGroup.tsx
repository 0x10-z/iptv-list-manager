import React from "react";
import { CheckSquare, Square, MinusSquare } from "lucide-react"; // Nuevo ícono para el estado parcial
import { ChannelItem } from "./ChannelItem";
import type { Channel } from "../types";

interface ChannelGroupProps {
  group: string;
  channels: Channel[];
  isExpanded: boolean;
  selectedChannels: string[];
  onToggleGroup: (group: string, isSelected: boolean) => void;
  onToggleChannel: (channelId: string) => void;
  onExpand: (group: string) => void;
}

export const ChannelGroup: React.FC<ChannelGroupProps> = ({
  group,
  channels,
  isExpanded,
  selectedChannels,
  onToggleGroup,
  onToggleChannel,
  onExpand,
}) => {
  // Verifica si todos o algunos canales del grupo están seleccionados
  const allSelected = channels.every((channel) =>
    selectedChannels.includes(channel.id)
  );
  const someSelected = channels.some((channel) =>
    selectedChannels.includes(channel.id)
  );

  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden mb-4">
      <div
        className="bg-gray-600 p-4 cursor-pointer flex justify-between items-center"
        onClick={() => onExpand(group)}
      >
        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleGroup(group, !allSelected); // Ahora pasa el nuevo estado
            }}
            className="mr-2 text-gray-200 focus:outline-none"
          >
            {allSelected ? (
              <CheckSquare className="w-5 h-5 text-gray-200" />
            ) : someSelected ? (
              <MinusSquare className="w-5 h-5 text-gray-400" /> // Estado parcial
            ) : (
              <Square className="w-5 h-5" />
            )}
          </button>
          <h3 className="text-lg font-semibold text-white">{group}</h3>
        </div>
        <span className="text-gray-300">{channels.length} canales</span>
      </div>

      {isExpanded && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((channel) => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              isSelected={selectedChannels.includes(channel.id)}
              onToggle={onToggleChannel}
            />
          ))}
        </div>
      )}
    </div>
  );
};
