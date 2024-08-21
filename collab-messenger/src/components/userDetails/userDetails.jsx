import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../state/app.context";
import { getUserData } from "../../services/user.services";
import { useNavigate } from "react-router-dom";
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
  <div className="details-container flex flex-col justify-between h-full w-full bg-blue-100 p-5">
    <div className="w-full">
      <div className="bg-gray-100 p-5 border-b rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold">Account Details</h2>
      </div>
      <div className="p-5 mt-60">
        <div className="flex mb-5">
          <div className="flex-1 text-center">
            {userData.photoURL ? (
              <img
                src={userData.photoURL}
                alt="Profile"
                className="rounded-full w-36 h-36 mx-auto"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-gray-300 flex items-center justify-center mx-auto">
                No Image
              </div>
            )}
          </div>
          <div className="flex-2 pl-5">
            <p className="mb-2"><strong>Username:</strong> {userData.handle}</p>
            <p className="mb-2"><strong>First Name:</strong> {userData.firstName || "Not Provided"}</p>
            <p className="mb-2"><strong>Last Name:</strong> {userData.lastName || "Not Provided"}</p>
            <p className="mb-2"><strong>Email:</strong> {userData.email}</p>
            <p className="mb-2"><strong>Phone Number:</strong> {userData.phoneNumber || "Not Provided"}</p>
            <p className="mb-2"><strong>Account Created On:</strong> {userData.createdOn}</p>
          </div>
        </div>
      </div>
    </div>
    <div className="p-5 text-center border-t rounded-lg shadow-md fixed bottom-0 left-0 right-0">
      <button
        className="bg-green-500 text-white px-5 py-2 rounded mr-2"
        onClick={editUser}
      >
        Edit Details
      </button>
      <button
        className="bg-gray-500 text-white px-5 py-2 rounded"
        onClick={goBack}
      >
        Go Back
      </button>
    </div>
  </div>
);
}


{/* <Container className="details-container">
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
    </Container> */}