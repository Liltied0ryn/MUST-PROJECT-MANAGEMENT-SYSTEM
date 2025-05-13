// Chat module
const chatModule = {
  // Initialize chat
  init: function() {
    if (!document.querySelector('.chat-interface')) return;
    
    // Load previous messages from localStorage
    this.loadMessages();
    
    // Set up event listeners
    document.querySelector('.chat-input button').addEventListener('click', this.sendMessage.bind(this));
    document.querySelector('.chat-input input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
    
    // Mock online status indicator
    this.setOnlineStatus(true);
  },
  
  // Load messages from localStorage
  loadMessages: function() {
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const chatContainer = document.getElementById('chatMessages');
    
    messages.forEach(msg => {
      this.appendMessage(msg.sender, msg.content, msg.timestamp);
    });
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
  },
  
  // Send a new message
  sendMessage: function() {
    const input = document.querySelector('.chat-input input');
    const message = input.value.trim();
    
    if (message) {
      // Append to chat
      this.appendMessage('You', message, new Date().toLocaleTimeString());
      
      // Save to localStorage
      const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
      messages.push({
        sender: 'You', 
        content: message,
        timestamp: new Date().toLocaleTimeString()
      });
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      
      // Clear input
      input.value = '';
      
      // Mock reply after 1 second
      setTimeout(() => {
        const replies = [
          "Thanks for your message!",
          "I'll review your submission shortly.",
          "Have you checked the latest requirements?",
          "Good progress! Keep it up."
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        this.appendMessage('Supervisor', reply, new Date().toLocaleTimeString());
        
        // Save reply to localStorage
        const updatedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        updatedMessages.push({
          sender: 'Supervisor', 
          content: reply,
          timestamp: new Date().toLocaleTimeString()
        });
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      }, 1000);
    }
  },
  
  // Append message to chat UI
  appendMessage: function(sender, content, timestamp) {
    const chatContainer = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    
    messageElement.className = `message ${sender === 'You' ? 'sent' : 'received'}`;
    messageElement.innerHTML = `
      <div class="message-content">
        <div class="message-sender">${sender}</div>
        <div class="message-text">${content}</div>
        <div class="message-time">${timestamp}</div>
      </div>
    `;
    
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  },
  
  // Set online status indicator
  setOnlineStatus: function(isOnline) {
    const statusIndicator = document.createElement('div');
    statusIndicator.className = `status-indicator ${isOnline ? 'online' : 'offline'}`;
    statusIndicator.innerHTML = `<i class="fas fa-circle"></i> ${isOnline ? 'Online' : 'Offline'}`;
    
    const chatHeader = document.querySelector('.chat-interface .card-header');
    chatHeader.appendChild(statusIndicator);
    
    // Pulse animation for online status
    if (isOnline) {
      setInterval(() => {
        statusIndicator.querySelector('i').style.opacity = statusIndicator.querySelector('i').style.opacity === '0.5' ? '1' : '0.5';
      }, 1000);
    }
  }
};

// Initialize chat module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  chatModule.init();
});