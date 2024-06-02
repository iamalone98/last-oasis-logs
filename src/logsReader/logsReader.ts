import EventEmitter from 'events';
import fs from 'fs';
import readline from 'readline';
import { Tail } from 'tail';
import { initLogger } from '../logger';
import { TLogReaderOptions } from '../types';
import { parseLine } from './parsers';

export class LogsReader extends EventEmitter {
  id: number;
  filePath: string;
  autoReconnect: boolean;
  logger: ReturnType<typeof initLogger>;
  tileName?: string;
  tail?: Tail;
  logEnabled?: boolean;
  timeout?: number;

  constructor(options: TLogReaderOptions) {
    super();

    for (const option of ['id', 'filePath', 'autoReconnect'])
      if (!(option in options))
        throw new Error(`${option} required!`);

    const { id, filePath, autoReconnect, logEnabled, timeout } =
      options;

    this.id = id;
    this.filePath = filePath;
    this.autoReconnect = autoReconnect;
    this.logEnabled = logEnabled;
    this.timeout = timeout;

    this.logger = initLogger(
      this.id,
      typeof options.logEnabled === 'undefined'
        ? true
        : options?.logEnabled,
    );

    this.setMaxListeners(20);
  }

  async init() {
    return new Promise((res) => {
      this.on('connected', () => res(true));

      this.#localReader();
    });
  }

  async close() {
    if (this.tail) {
      this.tail.unwatch();
      this.tail = undefined;
      this.logger.warn('Close connection');
      this.emit('close');
    }
  }

  getTileName() {
    return this.tileName;
  }

  #parseLine(line: string) {
    parseLine(line, this);
  }

  #getTileName() {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(this.filePath);
      const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity,
      });

      rl.on('line', (line) => {
        if (line.includes('tile_name')) {
          rl.close();
          stream.close();

          this.tileName = line.split('tile_name:')[1].trim();

          resolve(true);
        }
      });

      rl.on('close', () => {
        resolve(false);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  }

  async #localReader() {
    try {
      await this.#getTileName();

      this.tail = new Tail(this.filePath);

      this.logger.log(`Connected to ${this.tileName}`);
      this.emit('connected');

      this.tail.on('line', (data) => {
        this.#parseLine(data);
      });
    } catch (error) {
      this.logger.error('Connection lost');
      this.logger.error(error as string);
      this.emit('close');

      if (this.autoReconnect) {
        setTimeout(() => {
          this.logger.log('Reconnect');

          this.#localReader();
        }, 5000);
      }
    }
  }
}
