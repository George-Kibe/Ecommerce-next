"use client"
import styled from "styled-components";

/* 30px all round was a lot of the available width on a phone. */
const WhiteBox = styled.div`
  background-color: var(--surface-muted);
  color: var(--fg);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 16px;

  @media screen and (min-width: 768px) {
    padding: 24px;
  }
`;

export default WhiteBox;