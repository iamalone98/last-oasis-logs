export type TLogReaderOptions = {
  id: number;
  filePath: string;
  autoReconnect: boolean;
  timeout?: number;
  logEnabled?: boolean;
};

export type TChatMessage = {
  raw: string;
  time: string;
  chainID: string;
  name: string;
  message: string;
  event: string;
};

export type TTileName = {
  raw: string;
  time: string;
  chainID: string;
  name: string;
  event: string;
};
