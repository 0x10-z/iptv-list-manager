"use client";

import type React from "react";
import { useState, useCallback } from "react";
import type { Channel } from "../types";

interface FileUploadProps {
  setChannels: React.Dispatch<
    React.SetStateAction<{ [key: string]: Channel[] }>
  >;
}

export function FileUpload({ setChannels }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      setIsUploading(true);
      const content = await file.text();
      const lines = content.split("\n");
      const channelGroups: { [key: string]: Channel[] } = {};

      for (let i = 1; i < lines.length; i += 2) {
        if (lines[i].startsWith("#EXTINF")) {
          const info = lines[i];
          const url = lines[i + 1];
          const nameMatch = info.match(/tvg-name="([^"]*)"/);
          const logoMatch = info.match(/tvg-logo="([^"]*)"/);
          const groupMatch = info.match(/group-title="([^"]*)"/);
          const tvgIdMatch = info.match(/tvg-id="([^"]*)"/);
          const displayNameMatch = info.match(/,(.*)$/);

          const name = nameMatch ? nameMatch[1] : "Unknown";
          const displayName = displayNameMatch
            ? displayNameMatch[1].trim()
            : name;
          const group = groupMatch ? groupMatch[1] : "Uncategorized";
          const tvgId = tvgIdMatch ? tvgIdMatch[1] : "";

          const channel: Channel = {
            id: i.toString(),
            name: displayName,
            logo: logoMatch ? logoMatch[1] : "",
            group: group,
            url: url.trim(),
            tvgId: tvgId.trim(),
          };

          if (!channelGroups[group]) {
            channelGroups[group] = [];
          }
          channelGroups[group].push(channel);
        }
      }

      setChannels(channelGroups);
      setIsUploading(false);
    },
    [setChannels]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        processFile(e.target.files[0]);
      }
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
      <div
        className="flex items-center justify-center w-full"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <div className="text-white">Procesando archivo...</div>
            ) : (
              <>
                <svg
                  className="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">Haz clic para subir</span> o
                  arrastra y suelta
                </p>
                <p className="text-xs text-gray-400">Archivo M3U (MAX. 10MB)</p>
              </>
            )}
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept=".m3u"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}
