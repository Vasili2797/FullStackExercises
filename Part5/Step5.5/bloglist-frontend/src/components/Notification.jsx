import "../index.css";

const Notification = ({ message }) => {
  if (message === null || message == "") {
    return null;
  } else if (message.includes("a new blog")) {
    return <div className="newMessage">{message}</div>;
  } else {
    return <div className="error">{message}</div>;
  }
};

export default Notification;
