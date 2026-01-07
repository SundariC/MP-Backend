const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!newMessage.trim()) return;

  // ✅ Single source of truth
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const currentId = user?.id || storedUser?.id;
  const currentRole = user?.role || storedUser?.role;

  console.log("Debug - Current User ID:", currentId);

  if (!currentId) {
    toast.error("User session missing. Please re-login.");
    return;
  }

  const messageData = {
    bookingId,
    sender: currentId,
    text: newMessage,
    role: currentRole,
    timestamp: new Date().toISOString(),
  };

  try {
    socket.emit("send_message", messageData);

    await axios.post(
      "https://mp-backend-1-82km.onrender.com/api/messages/send",
      messageData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  } catch (err) {
    console.error("Message send failed:", err);
    toast.error("Failed to send message.");
  }
};
