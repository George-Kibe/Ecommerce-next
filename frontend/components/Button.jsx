"use client"
import styled, {css} from "styled-components";

export const ButtonStyle = css`
  border:0;
  /*
    Was 5px/15px, giving a ~34px tall control. The HIG minimum control size is
    44x44pt on iOS/iPadOS/watchOS, so these are sized to match — controls that
    are too small are hard for many people to hit accurately.
  */
  padding: 10px 18px;
  min-height: 44px;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-weight:500;
  &:disabled{
    opacity: .5;
    cursor: not-allowed;
  }
  svg{
    height: 16px;
    margin-right: 5px;
  }
  ${props => props.block && css`
    display: block;
    width: 100%;
  `}
  /*
    Variants read theme tokens rather than hardcoded #000/#fff, so they invert
    correctly in dark mode — a literal black button is invisible on a dark
    panel. "black" is the strongest contrast colour (black in light mode,
    near-white in dark); "white" is the page-surface colour.
  */
  ${props => props.white && !props.outline && css`
    background-color: var(--surface);
    color: var(--fg);
  `}
  ${props => props.white && props.outline && css`
    background-color: transparent;
    color: var(--fg);
    border: 1px solid var(--field-line);
  `}
  ${props => props.black && !props.outline && css`
    background-color: var(--strong);
    color: var(--on-strong);
  `}
  ${props => props.black && props.outline && css`
    background-color: transparent;
    color: var(--strong);
    border: 1px solid var(--strong);
  `}
  ${props => props.primary && !props.outline && css`
    background-color: var(--accent);
    border: 1px solid var(--accent);
    color: var(--on-accent);
    &:hover:not(:disabled){
      background-color: var(--accent-hover);
      border-color: var(--accent-hover);
    }
  `}
  ${props => props.primary && props.outline && css`
    background-color: transparent;
    border: 1px solid var(--link);
    color: var(--link);
  `}
  ${props => props.size === 'l' && css`
    font-size:1.2rem;
    padding: 10px 20px;
    svg{
      height: 20px;
    }
  `}
`;

const StyledButton = styled.button`
  ${ButtonStyle}
`;

export default function Button({children,...rest}) {
  return (
    <StyledButton {...rest}>{children}</StyledButton>
  );
}