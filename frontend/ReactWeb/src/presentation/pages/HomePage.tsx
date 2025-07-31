import React from "react";
import { UserProfile } from "../components/UserProfile";

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <h1>Welcome to Saiondo</h1>
      <p>This is a clean architecture React application.</p>
      <UserProfile />
    </div>
  );
};
