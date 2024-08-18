import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../state/app.context";
import { getUserData } from "../../services/user.services";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import "./UserDetails.css";

export default function UserDetails() {
  const { user, isLoading } = useContext(AppContext);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoading) {
        if (!user) {
          navigate("/login");
        } else {
          const data = await getUserData(user.uid);
          if (data) {
            const userKey = Object.keys(data)[0];
            setUserData(data[userKey]);
          }
        }
      }
    };

    if (!isLoading) {
      fetchUserData();
    }
  }, [user, isLoading]);

  if (isLoading || !userData) {
    return <p>Loading user details...</p>;
  }

  const editUser = () => {
    navigate("edituser");
  };

  const goBack = () => {
    navigate("/logged");
  };

  return (
    <Container className="details-container">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h2">Account Details</Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="text-center">
                  {userData.photoURL ? (
                    <Image
                      src={userData.photoURL}
                      alt="Profile"
                      roundedCircle
                      className="profile-image"
                    />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                </Col>
                <Col md={8}>
                  <p><strong>Username:</strong> {userData.handle}</p>
                  <p><strong>First Name:</strong>{" "}{userData.firstName || "Not Provided"}</p>
                  <p><strong>Last Name:</strong>{" "}{userData.lastName || "Not Provided"}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>Phone Number:</strong>{" "}{userData.phoneNumber || "Not Provided"}</p>
                  <p><strong>Account Created On:</strong> {userData.createdOn}</p>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button variant="success" className="me-2" onClick={editUser}>
                Edit Details
              </Button>
              <Button variant="secondary" onClick={goBack}>
                Go Back
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
