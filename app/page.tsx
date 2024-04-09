"use client";

import { useState } from "react";
import { Box, Button, Input, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import EPubViewer from "@/components/molecules/epubViewer";

const L2i = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFile(file);

      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            const text = event.target.result as string;
            setFileText(text);
          }
        };
        reader.readAsText(file);
      }
    }
  };

  return (
    <Box component="main">
      {file ? (
        <EPubViewer fileText={fileText} />
      ) : (
        <>
          <Box
            sx={{
              display: "block",
              m: "50px",
              height: "200px",
              overflowX: "auto",
            }}
          >
            <Typography fontSize={40} fontWeight="bold" textAlign="center">
              Input File
            </Typography>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              style={{ borderRadius: 20 }}
            >
              Upload file
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default L2i;
