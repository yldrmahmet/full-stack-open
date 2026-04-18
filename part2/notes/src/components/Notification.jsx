const Notification = ({ message, messageType }) => {
  if (message == null) return null;
  return messageType === "error" ? (
    <div className="error">{message}</div>
  ) : (
    <div className="success">{message}</div>
  );
};

export default Notification;
