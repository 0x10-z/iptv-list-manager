// src/components/ChannelActions.tsx
"use client";

import React from "react";
import {
  CheckSquare,
  Square,
  Trash2,
  FileOutputIcon as FileExport,
} from "lucide-react";

interface ChannelActionsProps {
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  onExportAll: () => void;
  selectedCount: number;
  groupCount: number;
  totalChannels: number;
  filteredChannelsCount: number;
}

export const ChannelActions: React.FC<ChannelActionsProps> = ({
  onSelectAll,
  onClearSelection,
  onDeleteSelected,
  onExportAll,
  selectedCount,
  groupCount,
  totalChannels,
  filteredChannelsCount,
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-400">
          Mostrando {filteredChannelsCount} de {totalChannels} canales |{" "}
          {selectedCount} canales seleccionados | {groupCount} grupos
          seleccionados
        </div>
        <div className="space-x-2">
          <button
            onClick={onSelectAll}
            className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer"
            title="Seleccionar todos los filtrados"
          >
            <CheckSquare className="w-5 h-5" />
          </button>
          <button
            onClick={onClearSelection}
            className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer"
            title="Quitar selección"
          >
            <Square className="w-5 h-5" />
          </button>
          <button
            onClick={onDeleteSelected}
            className={`p-2 text-white rounded-md ${
              selectedCount > 0
                ? "bg-red-600 hover:bg-red-700 cursor-pointer "
                : "bg-gray-500 cursor-not-allowed"
            }`}
            title="Eliminar seleccionados"
            disabled={selectedCount === 0}
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={onExportAll}
            className="cursor-pointer p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            title="Exportar todos"
          >
            <FileExport className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
};
