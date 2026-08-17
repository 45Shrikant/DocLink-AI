import React from "react";
import { FaInbox } from "react-icons/fa";

const Empty = ({ message = "Nothing to display at this time" }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1rem",
        textAlign: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "var(--bg-subtle)",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.75rem",
          marginBottom: "1rem",
        }}
      >
        <FaInbox />
      </div>
      <h3 style={{ fontSize: "1.2rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
        No Data Found
      </h3>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{message}</p>
    </div>
  );
};

export default Empty;
