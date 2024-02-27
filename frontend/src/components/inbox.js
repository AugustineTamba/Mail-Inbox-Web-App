import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  MDBNavbar,
  MDBContainer,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBNavbarBrand,
  MDBBadge, MDBBtn,
  MDBCollapse,
  MDBListGroup, MDBListGroupItem,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';

function Inbox() {
  const [messages, setMessages] = useState([]); 
  const [varyingState] = useState('');
  const [varyingModal, setVaryingModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
        const userId = sessionStorage.getItem('userId');
        if (!userId) return; 
      const response = await axios.get(`http://localhost:5000/api/messages/${userId}`);
      setMessages(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markAsRead = async (messageId) => {
    try {
        const userId = sessionStorage.getItem('userId');
        if (!userId) return; 

      await axios.patch(`http://localhost:5000/api/messages/${userId}/${messageId}/read`);
      const updatedMessages = messages.map((message) =>
        message._id === messageId ? { ...message, isRead: true } : message
      );
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const [openNavColor, setOpenNavColor] = useState(false);


  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
      });
      if (response.ok) {
        window.localStorage.clear();
        sessionStorage.clear();
        window.location.href = "./sign-in";
      } else {
        throw new Error("Failed to logout");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const sendMessage = async () => {
    try {

      if (!recipientEmail || !subject || !content) {
        setError('Please enter recipient email, subject, and message content.');
        return;
      }

      setSending(true);
      setError('');

      // Make API call to send message
      const response = await axios.post(
        'http://localhost:5000/api/send-message',
        { recipientEmail, subject, content }
      );

      console.log(response.data);
      // Reset form fields after successful send
      setRecipientEmail('');
      setSubject('');
      setContent('');

      setError('Message sent successfully.'); // Display success message
      setTimeout(() => {
        setVaryingModal(false); // Close modal after sending message
      }, 1500);
    } catch (error) {
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <MDBNavbar className=' p-2 bg-warning bg-gradient'expand='lg' dark  >
        <MDBContainer fluid>
          <MDBNavbarBrand href='/'> Let's Mail </MDBNavbarBrand>
          <MDBNavbarToggler
            type='button'
            data-target='#navbarColor02'
            aria-controls='navbarColor02'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setOpenNavColor(!openNavColor)}
          >
            <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>
          <MDBCollapse open={openNavColor} navbar>
            <MDBNavbarNav className='me-auto mb-2 mb-lg-0'>
              <MDBNavbarItem className='active'>
                <MDBNavbarLink aria-current='page' href='/'>
                  Home
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink href='/inbox'>Inbox </MDBNavbarLink>
              </MDBNavbarItem>

            </MDBNavbarNav>
            <div className='position-relative d-inline-block'>
              <button className="btn btn-primary"  onClick={() => {setVaryingModal(!varyingModal); }}>
                Compose
              </button>
            </div>
            <div className="d-flex p-2 flex-shrink-1"> </div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button className='btn btn-primary' onClick={handleLogout}> Logout </button>
            </div>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      <span className="d-block p-4 bg-primary bg-gradient text-white">My Inbox </span>

      <div className='p-5 text-center bg-light'>
        {messages.length === 0 ? (
          <p>No messages. Inbox is empty.</p>
        ) : (
          <MDBListGroup style={{ minWidth: '22rem' }} light>
            {messages.map((message) => (
              <Link
                key={message._id}
                to={`/message/${message._id}`}
                onClick={() => markAsRead(message._id)}
                className={`text-decoration-none ${!message.isRead ? 'bg-light' : ''}`}
              >
                <MDBListGroupItem
                  className={`d-flex justify-content-between align-items-center ${!message.isRead ? 'fw-bold' : ''}`}
                >
                  <div>
                    <p>{message.subject.substring(0, 12)}</p>
                  </div>
                  <div >
                    <p > {message.content.substring(0, 25)} </p>
                  </div>
                  {message.isRead ? (
                    <MDBBadge pill dark color='light' className="ms-3">
                      Read....
                    </MDBBadge>
                  ) : (
                    <MDBBadge pill dark color='success' className="ms-3">
                      Unread
                    </MDBBadge>
                  )}
                </MDBListGroupItem>
              </Link>
            ))}
          </MDBListGroup>
        )}
      </div>

      <MDBModal open={varyingModal} setOpen={setVaryingModal} tabIndex='-1'>
  <MDBModalDialog>
    <MDBModalContent>
      <MDBModalHeader>
        <MDBModalTitle>New message to {varyingState}</MDBModalTitle>
        <MDBBtn className='btn-close' color='none' onClick={() => setVaryingModal(!varyingModal)}></MDBBtn>
      </MDBModalHeader>
      <MDBModalBody>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {sending && (
          <div className="alert alert-info" role="alert">
            Sending...
          </div>
        )}
        <form>
          <div className='mb-3'>
            <label htmlFor="recipientEmail">Recipient Email:</label>
            <input
              type="email"
              id="recipientEmail"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="form-control"
            />
          </div>

          <div className='mb-3'>
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="form-control"
            />
          </div>

          <div className='mb-3'>
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-control"
            ></textarea>
          </div>
        </form>
      </MDBModalBody>
      <MDBModalFooter>
        <button className='btn btn-primary' color='secondary' onClick={() => setVaryingModal(!varyingModal)}>
          Close
        </button>
        <button className='btn btn-primary' onClick={sendMessage} disabled={sending}>
          Send
        </button>
      </MDBModalFooter>
    </MDBModalContent>
  </MDBModalDialog>
</MDBModal>



    </>
  );
}

export default Inbox;
