import React from 'react'
import './Popup.css'

function Popup(props) {
  return (props.trigger) ? (
    <div className="popup">
        <div className="popup-inner">
            <div id="total-popup-container">
              <h3 id="total-popup">Total: $2.00</h3>
            </div>
            
            <p id="email-text">Email(for bill & receipt)</p>
            <input type="text" id="email-box"></input>
            <button className="confirm-button">Confirm</button>
            <button className="cancel-button">Cancel</button>
            {props.children}
        </div>
    </div>
  ) : "";
}

export default Popup