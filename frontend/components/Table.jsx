"use client"
import styled from "styled-components";

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th{
    text-align: left;
    text-transform: uppercase;
    /*
      Was #ccc at .7rem — 1.47:1 against the whitesmoke panel, far below the
      4.5:1 the HIG cites from WCAG AA for text this size. Darkened to
      gray-600 and raised to .8rem (12.8px) so the column headings are
      actually readable.
    */
    color: var(--fg-subtle);
    font-weight: 600;
    font-size: .8rem;
    letter-spacing: .03em;
    padding-bottom: 8px;
  }
  td{
    border-top: 1px solid var(--divider);
    padding: 8px 0;
    vertical-align: middle;
  }
`;

/*
  A cart row (image + title + stepper + price) is wider than a phone. Without a
  scroll container the table forced the whole page to scroll sideways; now only
  the table scrolls, and only when it has to.
*/
const Scroller = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

export default function Table(props) {
  return (
    <Scroller>
      <StyledTable {...props} />
    </Scroller>
  );
}
