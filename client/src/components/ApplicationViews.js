import { Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { Home } from "./Home.js";
import { UserProfileList } from "./userProfiles/UserProfileList.js";
import { UserProfileDetails } from "./userProfiles/UserProfileDetails.js";
import { ChoresList } from "./chores/ChoresList.js";


export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      <Route path="/">

        <Route
          index
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <Home />
            </AuthorizedRoute>
          }
        />

        <Route
          path="home"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <Home />
            </AuthorizedRoute>
          }
        />

        <Route path="chores">
          <Route
            index
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                <ChoresList loggedInUser={loggedInUser} />
              </AuthorizedRoute>
            }
          />
          <Route
            path="pathName2_subPath"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                <p>PathName2_subPath</p>
              </AuthorizedRoute>
            }
          />

        </Route>

        <Route
          path="pathName3_AdminOnly"
          element={
            <AuthorizedRoute roles={["Admin"]} loggedInUser={loggedInUser}>
              <p>PathName3_AdminOnly</p>
            </AuthorizedRoute>
          }
        />

        <Route path="userProfiles">
          <Route
            index
            element={
              <AuthorizedRoute roles={["Admin"]} loggedInUser={loggedInUser}>
                <UserProfileList />
              </AuthorizedRoute>
            }
          />

          <Route
            path=":userId"
            element={
              <AuthorizedRoute roles={["Admin"]} loggedInUser={loggedInUser}>
                <UserProfileDetails />
              </AuthorizedRoute>
            }
          />

        </Route>

        <Route
          path="login"
          element={<Login setLoggedInUser={setLoggedInUser} />}
        />
        <Route
          path="register"
          element={<Register setLoggedInUser={setLoggedInUser} />}
        />
      </Route>
      <Route path="*" element={<p>More path can be added...</p>} />
    </Routes>
  );
}
