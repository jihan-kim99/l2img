import { Box, Button, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

const TxtViewer = ({ fileText }: { fileText: string }) => {
  const [currentPage, setCurrentPage] = useState(40);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const fileInLine = fileText.split("\n");
  const pageSize = 100;

  const pageCount = Math.ceil(fileInLine.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageText = fileInLine.slice(startIndex, endIndex);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
    setImageUrl(null);
    handleAskAI();
  };

  const generateImage = async (description: string) => {
    const fetchedData = await fetch("/api/generateImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: description,
      }),
    });

    if (!fetchedData.ok) {
      console.error("Error fetching image:", fetchedData.statusText);
      setImageUrl(null);
      return;
    }
    const { image: base64Image } = await fetchedData.json();
    setImageUrl(`data:image/jpeg;base64,${base64Image}`);
  };

  const handleAskAI = async () => {
    const res = await fetch("/api/askAI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: currentPageText.join("\n"),
      }),
    });
    const data = await res.json();
    const imageDesc = JSON.parse(data.text.message.content);
    console.log(imageDesc.isImage);
    if (imageDesc.isImage) {
      console.debug(imageDesc.description);
      generateImage(imageDesc.description);
    }
  };

  return (
    <>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={6} flex={1} flexWrap="wrap">
          {currentPageText.map((line, index) => (
            <Typography key={index} variant="body1" textAlign="start">
              {line}
            </Typography>
          ))}
        </Grid>
        <Grid item xs={6}>
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Generated Image"
              width={512}
              height={512}
            />
          )}
        </Grid>
      </Grid>
      <Box display="absolute" justifyContent="center" alignItems="center">
        <Button
          variant="contained"
          disabled={currentPage === 0}
          onClick={() => handlePageChange({ selected: currentPage - 1 })}
        >
          Back
        </Button>
        <Button
          variant="contained"
          disabled={currentPage === pageCount - 1}
          onClick={() => handlePageChange({ selected: currentPage + 1 })}
        >
          Next
        </Button>
        <Typography variant="body1">
          {currentPage + 1} / {pageCount}
        </Typography>
      </Box>
    </>
  );
};

export default TxtViewer;
