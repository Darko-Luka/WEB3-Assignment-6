import { clsx, type ClassValue } from "clsx"
import { Observable } from "rxjs";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepClone = (obj: any) => {
  if (obj === null || typeof obj !== 'object') return obj;

  const result = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = deepClone(obj[key]);
    }
  }
  return result;
}

export function createWebSocketObservable(url: string): Observable<MessageEvent> {
  return new Observable<MessageEvent>((observer) => {
    const socket = new WebSocket(url);

    // When the connection opens
    socket.onopen = () => {
       socket.send(JSON.stringify({ type: "subscribe" }))
    };

    // When a message is received
    socket.onmessage = (event) => {
      observer.next(event);
    };

    // When the connection closes
    socket.onclose = () => {
      observer.complete();
    };

    // If there's an error
    socket.onerror = (error) => {
      observer.error(error);
    };

    // Return the teardown function that closes the WebSocket connection
    return () => {
        if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "unsubscribe" }));
        socket.close();
      }
    } 
  });
}