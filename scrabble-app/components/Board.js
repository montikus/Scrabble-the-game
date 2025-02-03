'use client';
import React from 'react';

export default function Board({ board, /*onCellChange,*/ disabled }) {
  if (!board || !Array.isArray(board)) {
    return <div>Доска не загружена</div>;
  }

  // const handleChange = (row, col, e) => {
  //   if (disabled) return;
  //   const letter = e.target.value ? e.target.value[0].toUpperCase() : '';
  //   onCellChange(row, col, letter);
  // };

  return (
    <table style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
      <tbody>
        {board.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td
                key={colIndex}
                style={{
                  border: '1px solid #000',
                  width: '30px',
                  height: '30px',
                  textAlign: 'center',
                }}
              >
                <input
                  type="text"
                  value={cell}
                  // onChange={(e) => handleChange(rowIndex, colIndex, e)}
                  // style={{
                  //   width: '100%',
                  //   height: '100%',
                  //   textAlign: 'center',
                  //   fontSize: '16px',
                  // }}
                  maxLength={1}
                  disabled={disabled}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
