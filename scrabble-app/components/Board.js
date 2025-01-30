// components/Board.js
'use client';
import React from 'react';
import styles from './Board.module.css'; 

export default function Board() {
  const rows = 15; 
  const cols = 15;

  return (
    <div className={styles.board}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className={styles.cell}>
              {/* Здесь будет клетка доски */}
              {rowIndex},{colIndex}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
