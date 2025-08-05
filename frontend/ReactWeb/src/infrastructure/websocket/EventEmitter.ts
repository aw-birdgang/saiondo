export class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  /**
   * 이벤트 리스너 추가
   */
  on(event: string, listener: Function): this {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  /**
   * 이벤트 리스너 제거
   */
  off(event: string, listener: Function): this {
    if (!this.events[event]) return this;

    const index = this.events[event].indexOf(listener);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }

    if (this.events[event].length === 0) {
      delete this.events[event];
    }

    return this;
  }

  /**
   * 이벤트 발생
   */
  emit(event: string, ...args: any[]): boolean {
    if (!this.events[event]) return false;

    this.events[event].forEach(listener => {
      try {
        listener(...args);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });

    return true;
  }

  /**
   * 한 번만 실행되는 이벤트 리스너 추가
   */
  once(event: string, listener: Function): this {
    const onceWrapper = (...args: any[]) => {
      this.off(event, onceWrapper);
      listener(...args);
    };
    return this.on(event, onceWrapper);
  }

  /**
   * 특정 이벤트의 리스너 개수 반환
   */
  listenerCount(event: string): number {
    return this.events[event] ? this.events[event].length : 0;
  }

  /**
   * 모든 이벤트 리스너 제거
   */
  removeAllListeners(event?: string): this {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
    return this;
  }
}
