"use client"
import styled from "styled-components";

/*
  Was a flat 1.5em, which made the product-page <h1> barely larger than body
  copy. Scales with the viewport and keeps a clear top-level heading size.
*/
const Title = styled.h1`
  font-size: clamp(1.5rem, 1.1rem + 1.6vw, 2.25rem);
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 8px;
`;

export default Title;
