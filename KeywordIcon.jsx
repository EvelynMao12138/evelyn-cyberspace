import React from 'react';

// Fine continuous strokes echo the glass buttons without adding a filled badge.
const paths=[
 'M9 10 C5 10 3 14 3 22 C3 26 6 27 9 23 L12 20 H20 L23 23 C26 27 29 26 29 22 C29 14 27 10 23 10 H9 L9 14 M6 16 H12 M9 13 V19 M21 15 H21.1 M25 18 H25.1',
 'M11 10 C13 8 19 8 21 10 C24 13 22 18 19 20 L18 27 H14 L13 20 C10 18 8 13 11 10 Z M11 10 C9 6 3 5 3 10 C3 12 5 13 7 12 M21 10 C23 6 29 5 29 10 C29 12 27 13 25 12 M8 13 C8 10 4 10 4 13 C4 16 8 16 8 13 M24 13 C24 10 28 10 28 13 C28 16 24 16 24 13',
 'M6 5 H26 Q29 5 29 8 V24 Q29 27 26 27 H6 Q3 27 3 24 V8 Q3 5 6 5 Z M3 10 H29 M7 7.5 H7.1 M10 7.5 H10.1 M13 13 L21 17 L13 21 Z M8 24 H14 M18 24 H24',
 'M16 28 V5 L13 8 L16 5 L19 8 L16 5 V11 H5 L2 21 Q6 26 10 21 L6 11 H26 L22 21 Q26 26 30 21 L26 11 H16 V28 H9 H23',
 'M16 27 C12 23 7 23 3 24 V6 C8 5 12 6 16 9 V27 V9 C20 6 24 5 29 6 V24 C24 23 20 23 16 27',
 'M3 26 C3 20 7 18 11 18 C5 18 5 9 11 9 C17 9 17 18 11 18 C15 18 18 20 18 26 H29 C29 20 26 18 22 18 C16 18 16 9 22 9 C28 9 28 18 22 18 C18 18 15 20 15 26'
];
export default function KeywordIcon({index}){
 return <svg className="keyword-line-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[index]}/></svg>;
}
