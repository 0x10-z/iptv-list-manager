"use client";

import type React from "react";
import { useState, useMemo } from "react";
import type { Channel } from "../types";
import {
  Trash2,
  FileOutputIcon as FileExport,
  CheckSquare,
  Square,
} from "lucide-react";

interface ChannelListProps {
  channels: { [key: string]: Channel[] };
  setChannels: React.Dispatch<
    React.SetStateAction<{ [key: string]: Channel[] }>
  >;
}

export function ChannelList({ channels, setChannels }: ChannelListProps) {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const filteredChannels = useMemo(() => {
    const filtered: { [key: string]: Channel[] } = {};
    Object.entries(channels).forEach(([group, groupChannels]) => {
      const filteredGroupChannels = groupChannels.filter(
        (channel) =>
          channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredGroupChannels.length > 0) {
        filtered[group] = filteredGroupChannels;
      }
    });
    return filtered;
  }, [channels, searchQuery]);

  const totalChannels = useMemo(
    () => Object.values(channels).reduce((sum, group) => sum + group.length, 0),
    [channels]
  );

  const filteredChannelsCount = useMemo(
    () =>
      Object.values(filteredChannels).reduce(
        (sum, group) => sum + group.length,
        0
      ),
    [filteredChannels]
  );

  const handleToggleChannel = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleToggleGroup = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );

    const groupChannelIds = channels[group].map((channel) => channel.id);

    setSelectedChannels((prev) => {
      const isGroupSelected = prev.every((id) => groupChannelIds.includes(id));

      return isGroupSelected
        ? prev.filter((id) => !groupChannelIds.includes(id))
        : [...new Set([...prev, ...groupChannelIds])];
    });
  };

  const handleDeleteSelected = () => {
    const newChannels: { [key: string]: Channel[] } = {};
    Object.entries(channels).forEach(([group, groupChannels]) => {
      if (!selectedGroups.includes(group)) {
        newChannels[group] = groupChannels.filter(
          (channel) => !selectedChannels.includes(channel.id)
        );
      }
    });
    setChannels(newChannels);
    setSelectedChannels([]);
    setSelectedGroups([]);
  };

  const handleSelectAllFiltered = () => {
    const filteredIds: string[] = [];
    Object.values(filteredChannels).forEach((group) =>
      group.forEach((channel) => filteredIds.push(channel.id))
    );
    setSelectedChannels(filteredIds);
  };

  const handleExportAll = () => {
    let m3uContent = "#EXTM3U\n";
    Object.entries(channels).forEach(([group, groupChannels]) => {
      groupChannels.forEach((channel) => {
        m3uContent += `#EXTINF:-1 tvg-id="${channel.tvgId}" tvg-name="${channel.name}" tvg-logo="${channel.logo}" group-title="${group}",${channel.name}\n`;
        m3uContent += `${channel.url}\n`;
      });
    });

    const blob = new Blob([m3uContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "all_channels.m3u";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleGroupExpansion = (group: string) => {
    setExpandedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handleClearSelection = () => {
    setSelectedChannels([]);
    setSelectedGroups([]);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar canales o grupos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-400">
          Mostrando {filteredChannelsCount} de {totalChannels} canales |{" "}
          {selectedChannels.length} canales seleccionados |{" "}
          {selectedGroups.length} grupos seleccionados
        </div>
        <div className="space-x-2">
          <button
            onClick={handleSelectAllFiltered}
            className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            title="Seleccionar todos los filtrados"
          >
            <CheckSquare className="w-5 h-5" />
          </button>
          <button
            onClick={handleClearSelection}
            className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            title="Quitar selección"
          >
            <Square className="w-5 h-5" />
          </button>
          <button
            onClick={handleDeleteSelected}
            className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            title="Eliminar seleccionados"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleExportAll}
            className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            title="Exportar seleccionados"
          >
            <FileExport className="w-5 h-5" />
          </button>
          <button
            onClick={handleExportAll}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            title="Exportar todos"
          >
            <FileExport className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {Object.entries(filteredChannels).map(([group, groupChannels]) => (
          <div
            key={group}
            className="bg-gray-700 rounded-lg overflow-hidden mb-4"
          >
            <div
              className="bg-gray-600 p-4 cursor-pointer flex justify-between items-center"
              onClick={() => toggleGroupExpansion(group)}
            >
              <div className="flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleGroup(group);
                  }}
                  className="mr-2 text-gray-200 focus:outline-none"
                >
                  {selectedGroups.includes(group) ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                <h3 className="text-lg font-semibold text-white">{group}</h3>
              </div>
              <span className="text-gray-300">
                {groupChannels.length} canales
              </span>
            </div>
            {expandedGroups.includes(group) && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupChannels.map((channel) => (
                  <div
                    key={channel.id}
                    className={`bg-gray-800 rounded-lg p-4 hover:bg-gray-600 transition duration-200 ease-in-out cursor-pointer ${
                      selectedChannels.includes(channel.id)
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => handleToggleChannel(channel.id)}
                  >
                    <div className="flex items-center mb-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleChannel(channel.id);
                        }}
                        className="mr-2 text-gray-300 focus:outline-none"
                      >
                        {selectedChannels.includes(channel.id) ? (
                          <CheckSquare className="w-5 h-5" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                      <label className="flex-grow cursor-pointer font-semibold text-white">
                        {channel.name}
                      </label>
                    </div>
                    {channel.logo && (
                      <img
                        src={channel.logo || "/placeholder.svg"}
                        alt={channel.name}
                        className="w-16 h-16 object-contain mb-2 rounded-md"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
