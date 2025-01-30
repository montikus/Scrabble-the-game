// components/Tiles.js
'use client';
import React from 'react';
import styles from './Tiles.module.css';

export default function Tiles({ letters = [] }) {
  return (
    <div className={styles.tilesContainer}>
      {letters.map((letter, index) => (
        <div key={index} className={styles.tile}>
          {letter.toUpperCase()}
        </div>
      ))}
    </div>
  );
}
