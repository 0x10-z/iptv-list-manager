import { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { ChannelList } from "./components/ChannelList";
import type { Channel } from "./types";

function App() {
  const [channels, setChannels] = useState<{ [key: string]: Channel[] }>({});

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Gestor de Canales IPTV
        </h1>
        <FileUpload setChannels={setChannels} />
        <ChannelList channels={channels} setChannels={setChannels} />
      </div>
    </main>
  );
}

export default App;
