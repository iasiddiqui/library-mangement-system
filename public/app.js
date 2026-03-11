// Utility functions for the application

// Helper function to show messages
function showMessage(elementId, message, type = 'success') {
  const messageDiv = document.getElementById(elementId);
  if (messageDiv) {
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.className = '';
    }, 5000);
  }
}

