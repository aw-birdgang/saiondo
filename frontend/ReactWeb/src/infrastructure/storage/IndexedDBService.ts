export interface IIndexedDBService {
  openDatabase(): Promise<IDBDatabase>;
  createObjectStore(storeName: string, keyPath: string, options?: IDBObjectStoreParameters): void;
  add<T>(storeName: string, data: T): Promise<string>;
  get<T>(storeName: string, key: string): Promise<T | null>;
  getAll<T>(storeName: string): Promise<T[]>;
  update<T>(storeName: string, key: string, data: T): Promise<void>;
  delete(storeName: string, key: string): Promise<void>;
  clear(storeName: string): Promise<void>;
  closeDatabase(): void;
}

export class IndexedDBService implements IIndexedDBService {
  private dbName = 'SaiondoDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // 메시지 저장소
        if (!db.objectStoreNames.contains('messages')) {
          const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
          messageStore.createIndex('channelId', 'channelId', { unique: false });
          messageStore.createIndex('senderId', 'senderId', { unique: false });
          messageStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // 사용자 저장소
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
        }

        // 채널 저장소
        if (!db.objectStoreNames.contains('channels')) {
          const channelStore = db.createObjectStore('channels', { keyPath: 'id' });
          channelStore.createIndex('type', 'type', { unique: false });
          channelStore.createIndex('ownerId', 'ownerId', { unique: false });
        }

        // 파일 저장소
        if (!db.objectStoreNames.contains('files')) {
          const fileStore = db.createObjectStore('files', { keyPath: 'id' });
          fileStore.createIndex('messageId', 'messageId', { unique: false });
          fileStore.createIndex('type', 'type', { unique: false });
        }

        // 캐시 저장소
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
          cacheStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }
      };
    });
  }

  createObjectStore(storeName: string, keyPath: string, options?: IDBObjectStoreParameters): void {
    if (!this.db) {
      throw new Error('Database not opened');
    }

    if (!this.db.objectStoreNames.contains(storeName)) {
      this.db.createObjectStore(storeName, { keyPath, ...options });
    }
  }

  async add<T>(storeName: string, data: T): Promise<string> {
    if (!this.db) {
      await this.openDatabase();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => {
        resolve(request.result as string);
      };

      request.onerror = () => {
        reject(new Error(`Failed to add data to ${storeName}`));
      };
    });
  }

  async get<T>(storeName: string, key: string): Promise<T | null> {
    if (!this.db) {
      await this.openDatabase();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get data from ${storeName}`));
      };
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) {
      await this.openDatabase();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get all data from ${storeName}`));
      };
    });
  }

  async update<T>(storeName: string, key: string, data: T): Promise<void> {
    if (!this.db) {
      await this.openDatabase();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to update data in ${storeName}`));
      };
    });
  }

  async delete(storeName: string, key: string): Promise<void> {
    if (!this.db) {
      await this.openDatabase();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to delete data from ${storeName}`));
      };
    });
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) {
      await this.openDatabase();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to clear ${storeName}`));
      };
    });
  }

  closeDatabase(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  // 특화된 메서드들
  async getMessagesByChannel(channelId: string, limit = 50): Promise<any[]> {
    if (!this.db) {
      await this.openDatabase();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['messages'], 'readonly');
      const store = transaction.objectStore('messages');
      const index = store.index('channelId');
      const request = index.getAll(channelId);

      request.onsuccess = () => {
        const messages = request.result
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);
        resolve(messages);
      };

      request.onerror = () => {
        reject(new Error('Failed to get messages by channel'));
      };
    });
  }

  async getUserByEmail(email: string): Promise<any | null> {
    if (!this.db) {
      await this.openDatabase();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('email');
      const request = index.get(email);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error('Failed to get user by email'));
      };
    });
  }

  async getCacheItem<T>(key: string): Promise<T | null> {
    const item = await this.get<{ data: T; expiresAt: number }>('cache', key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      await this.delete('cache', key);
      return null;
    }
    
    return item.data;
  }

  async setCacheItem<T>(key: string, data: T, ttl: number = 300000): Promise<void> {
    const expiresAt = Date.now() + ttl;
    await this.update('cache', key, { data, expiresAt });
  }

  async clearExpiredCache(): Promise<void> {
    if (!this.db) {
      await this.openDatabase();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const index = store.index('expiresAt');
      const request = index.openCursor();

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          if (Date.now() > cursor.value.expiresAt) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => {
        reject(new Error('Failed to clear expired cache'));
      };
    });
  }
} 