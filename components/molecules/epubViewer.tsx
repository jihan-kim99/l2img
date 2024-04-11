import { Box, Button, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import Lottie from "react-lottie-player";

import loadingJson from "@/components/atom/loading.json";

const TxtViewer = ({
  fileText,
  isNarou,
  handleNextPage,
  subTitle,
}: {
  fileText: string;
  isNarou: boolean;
  handleNextPage: () => void;
  subTitle: string;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const fileInLine = fileText.split("\n");
  const pageSize = 25;

  const pageCount = Math.ceil(fileInLine.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageText = fileInLine.slice(startIndex, endIndex);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
    setImageUrl(null);
    scrollToTop();
    handleAskAI();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    handleAskAI();
    setCurrentPage(0);
    scrollToTop();
    setImageUrl(null);
  }, [fileText]);

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
      setImageUrl(null);
      console.debug(imageDesc.description);
      generateImage(imageDesc.description);
    }
  };

  return (
    <>
      <Typography variant="h4" textAlign="center" paddingTop={5}>
        {subTitle}
      </Typography>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={6} flex={1} flexWrap="wrap">
          {currentPageText.map((line, index) => (
            <Typography
              key={index}
              variant="body1"
              textAlign="start"
              paddingLeft={5}
              paddingTop={2}
            >
              {line}
            </Typography>
          ))}
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {imageUrl ? (
            <Box sx={{ width: "100%", p: "4rem" }}>
              <Image
                src={imageUrl}
                alt="Generated Image"
                width={400}
                height={400}
              />
            </Box>
          ) : (
            <Lottie
              loop
              animationData={loadingJson}
              play
              style={{ width: 180, height: 180 }}
            />
          )}
        </Grid>
      </Grid>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        margin={10}
      >
        <Button
          variant="contained"
          disabled={currentPage === 0}
          onClick={() => handlePageChange({ selected: currentPage - 1 })}
          style={{ marginRight: 10 }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          disabled={currentPage === pageCount - 1}
          onClick={() => handlePageChange({ selected: currentPage + 1 })}
          style={{ marginRight: 10 }}
        >
          Next
        </Button>
        <Button
          variant="contained"
          disabled={!isNarou}
          onClick={() => handleNextPage()}
          style={{ marginRight: 10 }}
        >
          Next Episode
        </Button>
        <Typography variant="body1">
          {currentPage + 1} / {pageCount}
        </Typography>
      </Box>
    </>
  );
};

export default TxtViewer;
