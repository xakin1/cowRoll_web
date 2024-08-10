import React from "react";

function getToken() {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  return token;
}

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = getToken();
  if (!token) {
    window.location.href = "/";
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
