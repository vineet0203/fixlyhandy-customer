import React, { useEffect, useState, useRef } from 'react';
import { getCustomerConversations, sendCustomerMessage, markCustomerAsRead } from '../api/customerPortal';
import ChatWindow from '../components/ChatWindow';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import apiClient from '../api/client';
import './CustomerMessages.css';

const CustomerMessages = () => {
  const [vendor, setVendor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem('customer_token');
  const profile = JSON.parse(localStorage.getItem('customer_profile') || '{}');
  const customerId = profile?.id;
  const echoInstanceRef = useRef(null);

  const loadConversation = async () => {
    setLoading(true);
    try {
      const data = await getCustomerConversations();
      setVendor(data.data?.vendor || null);
      setMessages(data.data?.messages || []);
      
      if (data.data?.vendor) {
        await markCustomerAsRead(data.data.vendor.id);
        window.dispatchEvent(new CustomEvent('customer-messages-updated'));
      }
    } catch (e) {
      console.error('Error fetching conversation:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversation();
  }, []);

  // Setup Echo subscription for real-time messages
  useEffect(() => {
    if (!customerId || !vendor?.id || !token) return;

    if (!echoInstanceRef.current) {
      window.Pusher = Pusher;
      echoInstanceRef.current = new Echo({
        broadcaster: 'reverb',
        key: 'idgq8iuytafdhi8zrh2u',
        wsHost: 'api.fixlyhandy.com',
        wsPort: 8080,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        authEndpoint: `${apiClient.defaults.baseURL}/chat/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });
    }

    const channelName = `chat.vendor.${vendor.id}.customer.${customerId}`;
    const channel = echoInstanceRef.current.private(channelName);

    channel.listen('.message.sent', (data) => {
      if (data.customer_id === customerId && data.vendor_id === vendor.id) {
        setMessages(prev => {
          if (prev.some(m => m.id === data.id)) return prev;
          return [...prev, data];
        });

        if (data.sender_type === 'vendor') {
          markCustomerAsRead(vendor.id).catch(console.error);
        }
      }
    });

    return () => {
      if (echoInstanceRef.current) {
        echoInstanceRef.current.leave(channelName);
      }
    };
  }, [customerId, vendor?.id, token]);

  const handleSend = async (body) => {
    if (!vendor?.id) return;
    try {
      const response = await sendCustomerMessage(vendor.id, body);
      const newMsg = response.data;
      
      setMessages(prev => [...prev, newMsg]);
    } catch (e) {
      console.error('Error sending message:', e);
    }
  };

  if (loading) {
    return <div className="customer-chat-loading">Loading messaging panel...</div>;
  }

  return (
    <div className="customer-messages-page">
      {vendor ? (
        <div className="customer-chat-container">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSend}
            recipientName={vendor.business_name || vendor.full_name}
            currentUserType="customer"
          />
        </div>
      ) : (
        <div className="customer-no-vendor">
          <h3>No conversation history or associated vendor found</h3>
          <p>Once you are assigned to a job or quote, you can message your service provider here.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerMessages;
