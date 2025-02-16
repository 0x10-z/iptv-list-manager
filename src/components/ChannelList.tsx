import type React from "react";
import { useState, useMemo } from "react";
import type { Channel } from "../types";

interface ChannelListProps {
  channels: Channel[];
  setChannels: React.Dispatch<React.SetStateAction<Channel[]>>;
}

export function ChannelList({ channels, setChannels }: ChannelListProps) {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChannels = useMemo(() => {
    return channels.filter(
      (channel) =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.group.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [channels, searchQuery]);

  const handleToggleChannel = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleDeleteSelected = () => {
    setChannels(
      channels.filter((channel) => !selectedChannels.includes(channel.id))
    );
    setSelectedChannels([]);
  };

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredChannels.map((channel) => channel.id);
    setSelectedChannels(filteredIds);
  };

  const handleExport = () => {
    const selectedChannelsData = channels.filter((channel) =>
      selectedChannels.includes(channel.id)
    );
    let m3uContent = "#EXTM3U\n";
    selectedChannelsData.forEach((channel) => {
      m3uContent += `#EXTINF:-1 tvg-id="" tvg-name="${channel.name}" tvg-logo="${channel.logo}" group-title="${channel.group}",${channel.name}\n`;
      m3uContent += `${channel.url}\n`;
    });

    const blob = new Blob([m3uContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exported_channels.m3u";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar canales..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-400">
          Mostrando {filteredChannels.length} de {channels.length} canales |{" "}
          {selectedChannels.length} seleccionados
        </div>
        <div className="space-x-2">
          <button
            onClick={handleSelectAllFiltered}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 ease-in-out"
          >
            Seleccionar todos los filtrados
          </button>
          <button
            onClick={handleDeleteSelected}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 ease-in-out"
          >
            Eliminar seleccionados
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ease-in-out"
          >
            Exportar seleccionados
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChannels.map((channel) => (
          <div
            key={channel.id}
            className={`bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition duration-200 ease-in-out cursor-pointer ${
              selectedChannels.includes(channel.id)
                ? "ring-2 ring-blue-500"
                : ""
            }`}
            onClick={() => handleToggleChannel(channel.id)}
          >
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`channel-${channel.id}`}
                checked={selectedChannels.includes(channel.id)}
                onChange={() => {}}
                className="mr-2 form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
              />
              <label
                htmlFor={`channel-${channel.id}`}
                className="flex-grow cursor-pointer font-semibold text-white"
              >
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
            <p className="text-sm text-gray-400">Grupo: {channel.group}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
