"use client"
import styled from "styled-components";

/*
  Padding raised from 5px so the field meets the 44pt minimum control size, and
  the border darkened from #ccc (1.6:1) to gray-400 so the field boundary is
  actually visible against a white panel.
*/
const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  min-height: 44px;
  margin-bottom: 8px;
  border: 1px solid var(--field-line);
  background-color: var(--field);
  color: var(--fg);
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 1rem;
`;

export default function Input(props) {
  return <StyledInput {...props} />
}
