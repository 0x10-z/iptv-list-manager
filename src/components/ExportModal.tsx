import React from "react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (filename: string) => void;
  estimatedSize: number;
  filename: string;
  setFilename: React.Dispatch<React.SetStateAction<string>>;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  estimatedSize,
  filename,
  setFilename,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex justify-center items-center">
      <div
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-white mb-4">
          Exportar Archivo
        </h2>
        <p className="text-gray-300 mb-4">
          El archivo tendrá un tamaño estimado de{" "}
          <span className="font-bold">{estimatedSize.toFixed(2)} KB</span> - (
          <span className="font-bold">
            {(estimatedSize / 1024).toFixed(2)} MB
          </span>
          )
        </p>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nombre del archivo"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(filename)}
            className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
          >
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
};
