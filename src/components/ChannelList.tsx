import React, { useState, useMemo } from "react";
import { ChannelGroup } from "./ChannelGroup";
import { ChannelActions } from "./ChannelActions";
import type { Channel } from "../types";
import { ExportModal } from "./ExportModal";

interface ChannelListProps {
  channels: { [key: string]: Channel[] };
  setChannels: React.Dispatch<
    React.SetStateAction<{ [key: string]: Channel[] }>
  >;
}

export const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  setChannels,
}) => {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [exportFilename, setExportFilename] =
    useState<string>("all_channels.m3u");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDeleteSelected = () => {
    setChannels((prevChannels) => {
      const newChannels: { [key: string]: Channel[] } = {};

      Object.entries(prevChannels).forEach(([group, groupChannels]) => {
        // Filtra los canales eliminando los que están en selectedChannels
        const updatedGroupChannels = groupChannels.filter(
          (channel) => !selectedChannels.includes(channel.id)
        );

        if (updatedGroupChannels.length > 0) {
          newChannels[group] = updatedGroupChannels;
        }
      });

      return newChannels;
    });

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

  const handleExportAll = (fileName: string) => {
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
    a.download = fileName.endsWith(".m3u") ? fileName : `${fileName}.m3u`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleToggleChannel = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleToggleGroup = (group: string, isSelected: boolean) => {
    setSelectedGroups((prev) =>
      isSelected ? [...prev, group] : prev.filter((g) => g !== group)
    );

    const groupChannelIds = channels[group].map((channel) => channel.id);

    setSelectedChannels(
      (prev) =>
        isSelected
          ? [...new Set([...prev, ...groupChannelIds])] // Añadir todos los canales del grupo
          : prev.filter((id) => !groupChannelIds.includes(id)) // Eliminar todos los canales del grupo
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

      {/* Integración del nuevo componente de botones */}
      <ChannelActions
        onSelectAll={handleSelectAllFiltered}
        onClearSelection={handleClearSelection}
        onDeleteSelected={handleDeleteSelected}
        onExportAll={() => setIsModalOpen(true)}
        selectedCount={selectedChannels.length}
        groupCount={selectedGroups.length}
        totalChannels={totalChannels}
        filteredChannelsCount={filteredChannelsCount}
      />

      {isModalOpen && (
        <ExportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={(filename) => {
            setExportFilename(filename);
            setIsModalOpen(false);
            handleExportAll(filename);
          }}
          estimatedSize={filteredChannelsCount * 0.3}
          filename={exportFilename}
          setFilename={setExportFilename}
        />
      )}

      <div className="space-y-4">
        {Object.entries(filteredChannels).map(([group, groupChannels]) => (
          <ChannelGroup
            key={group}
            group={group}
            channels={groupChannels}
            isExpanded={expandedGroups.includes(group)}
            selectedChannels={selectedChannels}
            onToggleGroup={handleToggleGroup}
            onToggleChannel={handleToggleChannel}
            onExpand={(g) =>
              setExpandedGroups((prev) =>
                prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
              )
            }
          />
        ))}
      </div>
    </div>
  );
};
