"use client"
import styled from "styled-components";

const StyledTable = styled.table`
  width: 100%;
  th{
    text-align: left;
    text-transform: uppercase;
    /*
      Was #ccc at .7rem — 1.47:1 against the whitesmoke panel, far below the
      4.5:1 the HIG cites from WCAG AA for text this size. Darkened to
      gray-600 and raised to .8rem (12.8px) so the column headings are
      actually readable.
    */
    color: #4b5563;
    font-weight: 600;
    font-size: .8rem;
    letter-spacing: .03em;
  }
  td{
    border-top: 1px solid rgba(0,0,0,.1);
  }
`;

export default function Table(props) {
  return <StyledTable {...props} />
}
