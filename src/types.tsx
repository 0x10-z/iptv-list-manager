export interface Channel {
  id: string;
  name: string;
  logo: string;
  group: string;
  url: string;
  tvgId: string;
}

export type ChannelsState = { [key: string]: Channel[] }; // Diccionario de grupos de canales
