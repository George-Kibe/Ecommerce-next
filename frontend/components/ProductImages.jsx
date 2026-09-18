"use client"
import styled from "styled-components";
import {useState} from "react";

const Thumb = styled.img`
  max-width: 100%;
  max-height: 100%;
`;
const BigImage = styled.img`
  max-width: 100%;
  max-height: 200px;
`;
const ImageButtons = styled.div`
  display: flex;
  gap: 10px;
  flex-grow: 0;
  margin-top: 10px;
  flex-wrap: wrap;
`;

/*
  Was a clickable <div>: not reachable by keyboard, not announced as a control,
  and the selected state was a #ccc border against transparent — a colour-only
  cue at 1.6:1.

  Now a real <button> (focusable, Enter/Space work, exposed to VoiceOver), at
  least 44x44 to meet the HIG minimum control size, with the selection shown by
  a thicker high-contrast border *and* aria-pressed rather than colour alone.
*/
const ImageButton = styled.button`
  border: 2px solid ${props => (props.$active ? "#1d4ed8" : "#6b7280")};
  outline-offset: 2px;
  background: #fff;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  cursor: pointer;
  border-radius: 5px;
`;

export default function ProductImages({images = []}) {
  const [activeImage, setActiveImage] = useState(images?.[0]);

  if (!images.length) return null;

  return (
    <>
      <div style={{textAlign: "center"}}>
        <BigImage src={activeImage} alt="" />
      </div>
      <ImageButtons>
        {images.map((image, index) => {
          const isActive = image === activeImage;
          return (
            <ImageButton
              key={image}
              type="button"
              $active={isActive}
              aria-pressed={isActive}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              onClick={() => setActiveImage(image)}
            >
              <Thumb src={image} alt="" />
            </ImageButton>
          );
        })}
      </ImageButtons>
    </>
  );
}
