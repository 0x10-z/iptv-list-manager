import { create } from "zustand";

interface Channel {
  id: string;
  name: string;
  logo: string;
  group: string;
  url: string;
}

interface ChannelStore {
  channels: Channel[];
  setChannels: (channels: Channel[]) => void;
}

export const useChannels = create<ChannelStore>((set) => ({
  channels: [],
  setChannels: (channels) => set({ channels }),
}));
