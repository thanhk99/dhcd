import { Client, StompSubscription, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { tokenManager } from '@/utils/tokenManager';

const WS_URL = 'http://localhost:8085/ws';

export class WebSocketService {
    private client: Client;
    private connected: boolean = false;
    private subscriptions: Map<string, StompSubscription> = new Map();

    constructor() {
        this.client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => {
                if (process.env.NODE_ENV === 'development') {
                    console.log('[WS Debug]:', str);
                }
            },
        });

        this.client.onConnect = (frame) => {
            console.log('Connected to WebSocket');
            this.connected = true;
        };

        this.client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        this.client.onWebSocketClose = () => {
            console.log('WebSocket connection closed');
            this.connected = false;
        };
    }

    public connect() {
        console.log('WebSocket connection is temporarily disabled.');
        return;

        // if (this.connected) return;

        // const token = tokenManager.getAccessToken();
        // if (token) {
        //     this.client.connectHeaders = {
        //         Authorization: `Bearer ${token}`,
        //     };
        // }

        // this.client.activate();
    }

    public disconnect() {
        if (!this.connected) return;

        this.client.deactivate();
        this.connected = false;
        console.log('Disconnected from WebSocket');
    }

    public subscribe(topic: string, callback: (message: IMessage) => void): StompSubscription {
        if (!this.client.connected) {
            console.warn('WebSocket not connected. Subscription might fail or be delayed.');
        }

        // Ensure we are connected before subscribing? 
        // stompjs handles queuing subscriptions if not connected locally, 
        // but 'connected' state check is good practice.

        const subscription = this.client.subscribe(topic, callback);
        this.subscriptions.set(topic, subscription);
        return subscription;
    }

    public unsubscribe(topic: string) {
        const subscription = this.subscriptions.get(topic);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(topic);
        }
    }
}

// Export a singleton instance
export const webSocketService = new WebSocketService();
