import React from "react";
import '../index.css';

const Notification = ({ name }) => {
  if (name === null || name==='') {
    return null
  }

  return (
    <div className="newMessage">
      {name}
    </div>
  )
}

export default Notification
