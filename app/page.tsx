"use client";

import { useState } from "react";
import { Box, Button, Input, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import EPubViewer from "@/components/molecules/epubViewer";

const L2i = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState<string>("");
  const [subTitle, setSubTitle] = useState<string>("");
  const [webUrl, setWebUrl] = useState("");
  const [isNarou, setIsNarou] = useState(false);

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
  const handleWebUrlCrawl = () => {
    fetch("/api/crawlNarou", {
      method: "POST",
      body: JSON.stringify({ url: webUrl }),
    })
      .then((res) => res.json())
      .then((res) => {
        setFileText(res.lightText);
        setSubTitle(res.subTitle);
        setIsNarou(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleNextPage = () => {
    let url = new URL(webUrl);
    let pathParts = url.pathname.split("/");
    pathParts[2] = (parseInt(pathParts[2]) + 1).toString();
    let newPath = pathParts.join("/");
    url.pathname = newPath;
    setWebUrl(url.toString());
    handleWebUrlCrawl();
  };

  return (
    <Box component="main">
      {fileText ? (
        <EPubViewer
          fileText={fileText}
          subTitle={subTitle}
          isNarou={isNarou}
          handleNextPage={handleNextPage}
        />
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
              style={{ borderRadius: 20, width: 200 }}
            >
              Upload file
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>
          <Typography
            fontSize={40}
            fontWeight="bold"
            textAlign="center"
            marginTop={10}
          >
            Or
          </Typography>
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              width: "100%",
              mt: "100px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "70%" }}>
              <Input
                value={webUrl}
                fullWidth
                placeholder="Input web url"
                onChange={(e) => setWebUrl(e.target.value)}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              style={{ margin: "20px", borderRadius: 20, width: 200 }}
              onClick={handleWebUrlCrawl}
            >
              Load
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default L2i;
