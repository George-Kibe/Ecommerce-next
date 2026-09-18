"use client"
import styled from "styled-components";
import {useState} from "react";

const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
/*
  Was capped at 200px tall, so the main shot ended up smaller than its own
  thumbnails. A fixed height is wrong here too: a wide product in a tall box
  letterboxes with large empty bands above and below. Natural height with a cap
  lets the box track the image, and `contain` keeps tall images inside it.
*/
const BigImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  max-height: 420px;
  object-fit: contain;
  margin: 0 auto;
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
  border: 2px solid ${props => (props.$active ? "var(--link)" : "var(--field-line)")};
  outline-offset: 2px;
  background: var(--image-tile);
  filter: brightness(var(--image-dim));
  /* Fixed thumbnail size. With only a minimum, a wide source image stretched
     the button to the full column width — as big as the main image. 64px stays
     well above the 44pt minimum hit target. */
  width: 64px;
  height: 64px;
  flex-shrink: 0;
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
