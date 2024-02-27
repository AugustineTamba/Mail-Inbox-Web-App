import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  MDBBadge, 
  MDBCollapse
} from 'mdb-react-ui-kit';

function UserMail() {

  const [unreadCount, setUnreadCount] = useState(0);
  const [allMessagesCount, setAllMessagesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [setMessage] = useState('');
  const [openNavColor, setOpenNavColor] = useState(false);
  const { userId } = useParams();
  const isLoggedIn = sessionStorage.getItem("loggedIn");

  // if (isLoggedIn === true) {
  //   window.location.reload(); 
  // }
  
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        if (!userId) return; // User not logged in
        const response = await axios.get(
          `http://localhost:5000/user/${userId}`,
          {crossDomain: true},
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
    
        if (response.data.User) {
          console.log('okay');
          setUserData(response.data.User);
        } else {
          setMessage('User data fetch failed');
          console.log('User data fetch failed');
          // Handle login error
        }
      } catch (error) {
        console.error(error);
        setMessage("User data fetch failed");
      }
    };

    getUserData();
  }, [userId, setMessage]);

  useEffect(() => {
    const fetchUnreadMessagesCount = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        if (!userId) return; // User not logged in
  
        // Fetch unread messages count for the logged-in user
        const response = await fetch(`http://localhost:5000/api/messages/unread/count/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.count);
        } else {
          throw new Error('Failed to fetch unread messages count');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching unread messages count:', error);
      }
    };
  
    fetchUnreadMessagesCount();
  }, [userId]);
  
  useEffect(() => {
    const fetchAllMessagesCount = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        if (!userId) return; // User not logged in
  
        // Fetch unread messages count for the logged-in user
        const response = await fetch(`http://localhost:5000/api/messages/count/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setAllMessagesCount(data.count);
        } else {
          throw new Error('Failed to fetch unread messages count');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching unread messages count:', error);
      }
    };
  
    fetchAllMessagesCount();
  }, [userId]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MDBNavbar className=' p-2 bg-warning bg-gradient'expand='lg' dark  >
        <MDBContainer fluid>
          <MDBNavbarBrand href='#'> Let's Mail </MDBNavbarBrand>
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
              <a className='btn btn-primary' href='/inbox' role='button'> inbox </a>
              <MDBBadge color='danger' dark pill className='position-absolute translate-middle'>
                {unreadCount}
              </MDBBadge>
            </div>
              <div className="d-flex p-2 flex-shrink-1"> </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button className='btn btn-primary' onClick={handleLogout}> Logout </button>
              </div>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      <span className="d-block p-4 bg-primary bg-gradient text-white">Hello {userData.firstName + ' ' + userData.lastName}👋 
      
      </span>
      <div className='p-5 text-center bg-light'>
        <h2 className='mb-3'>Welcome  to your Dashboard!</h2>
        <h6 className='mb-3'>You have {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'} out of  {allMessagesCount} {allMessagesCount === 1 ? 'message' : 'messages'}. </h6>
        <a className='btn btn-primary' href='/inbox' role='button'>
          View Messages
        </a>
      </div>
    </>
  );
}

export default UserMail;
