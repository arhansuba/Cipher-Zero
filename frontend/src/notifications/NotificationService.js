// NotificationService.js

class NotificationService {
    constructor() {
      this.notifications = [];
      this.subscribers = [];
    }
  
    // Subscribe to notifications
    subscribe(callback) {
      this.subscribers.push(callback);
    }
  
    // Unsubscribe from notifications
    unsubscribe(callback) {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }
  
    // Notify all subscribers
    notify() {
      this.subscribers.forEach(callback => callback(this.notifications));
    }
  
    // Add a notification
    addNotification(message, type = 'info') {
      const notification = {
        id: Date.now().toString(),
        message,
        type,
      };
      this.notifications.push(notification);
      this.notify();
    }
  
    // Remove a notification by id
    removeNotification(id) {
      this.notifications = this.notifications.filter(notification => notification.id !== id);
      this.notify();
    }
  
    // Get all notifications
    getNotifications() {
      return this.notifications;
    }
  }
  
  const notificationService = new NotificationService();
  export default notificationService;
  