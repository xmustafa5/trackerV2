import React, { useEffect, useState } from "react";
import "react-calendar-heatmap/dist/styles.css";
import insideImage from "../assets/Business Owner/مشروع جديد.png";
const totalRows = 20; // Total number of rows
const totalColumns = 20; // Total number of columns

// Import images dynamically
const importImages = async (rows, columns) => {
  const images = [];
  for (let row = 1; row <= rows; row++) {
    for (let column = 1; column <= columns; column++) {
      // Construct the image path dynamically and await the import
      try {
        const image = await import(
          `../assets/Business Owner/imageFill/row-${row}-column-${column}.png`
        );
        images.push(image.default); // Push the default export
      } catch (error) {
        console.error(
          `Error loading image: row-${row}-column-${column}`,
          error
        );
      }
    }
  }
  return images;
};

function ImageSplit() {
  const [images, setImages] = useState([]);

  const calculateDistance = (x1, y1, x2, y2) => {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleMouseMove = (e) => {
    const container = document.querySelector(".image-container");
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    const images = document.querySelectorAll(".split-image");
    images.forEach((img) => {
      const imgElement = img as HTMLElement;
      const imgRect = imgElement.getBoundingClientRect();
      const imgCenterX = imgRect.left - containerRect.left + imgRect.width / 2;
      const imgCenterY = imgRect.top - containerRect.top + imgRect.height / 2;

      const distance = calculateDistance(
        mouseX,
        mouseY,
        imgCenterX,
        imgCenterY
      );
      const maxDistance = 150;

      if (distance < maxDistance) {
        const deltaX = imgCenterX - mouseX;
        const deltaY = imgCenterY - mouseY;
        const angle = Math.atan2(deltaY, deltaX);
        const translationFactor =
          ((maxDistance - distance) / maxDistance) * 300;

        imgElement.style.transform = `translate(${
          Math.cos(angle) * translationFactor
        }px, ${Math.sin(angle) * translationFactor}px) skew(${
          Math.cos(angle) * 5
        }deg, ${Math.sin(angle) * 5}deg) rotate(${
          ((maxDistance - distance) / maxDistance) * 30
        }deg)`;
        imgElement.style.transition = "transform 0.3s ease";
      } else {
        imgElement.style.transform = "";
      }
    });
  };

  const handleMouseLeave = () => {
    const images = document.querySelectorAll(".split-image");
    images.forEach((img) => {
      (img as HTMLElement).style.transform = "";
    });
  };

  // Initial load images effect
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = await importImages(totalRows, totalColumns);
      setImages(loadedImages);
    };
    loadImages();
  }, []);

  // Setup initial positions and mouse handlers
  useEffect(() => {
    if (images.length === 0) return;

    const container = document.querySelector(".image-container");
    if (!container) return;

    // Add mouse event listeners to container
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Setup initial positions
    const imageElements = document.querySelectorAll(".split-image");
    imageElements.forEach((img, index) => {
      const element = img as HTMLElement;
      const row = Math.floor(index / totalColumns);
      const col = index % totalColumns;

      element.style.top = `${row * 50}px`;
      element.style.left = `${col * 50}px`;
    });

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [images]);

  return (
    <div
      className="image-container"
      style={{
        position: "relative",
        height: `${totalRows * 50}px`,
        width: `${totalColumns * 50}px`,
        margin: "auto",
        overflow: "hidden",
      }}
    >
      <img
        src={insideImage}
        className="w-full absolute  z-50"
        style={{
          position: "absolute",
          width: "100%",
          transition: "transform 0.3s ease",
        }}
      />
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Row ${Math.floor(index / totalColumns) + 1} Column ${
            (index % totalColumns) + 1
          }`}
          className="split-image "
          style={{
            position: "absolute",
            width: "52px",
            height: "52px",
            transition: "transform 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

export default ImageSplit;
