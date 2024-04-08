"use server";

import { Box, Typography } from "@mui/material";

import PingButton from "@/components/atom/PingButton";

const l2i = () => {
  const handlePing = () => {
    fetch("/api/ping")
      .then((res) => res.json())
      .then((data) => console.log(data));
  };
  return (
    <Box component="main">
      <Typography variant="h4" textAlign="center">
        Upload Your Light Novel txt to read
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <PingButton handlePing={handlePing} />
      </Box>
    </Box>
  );
};

export default l2i;
