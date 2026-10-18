import fs from 'fs';

// Check exact text structure
const testItems = [
  { time: '16:00 · 27/11', title: 'ĐẠI TIỆC' },
  { time: '19:00 · 27/11', title: 'ÂM NHẠC DJ' },
  { time: '10:00 · 28/11', title: 'ĐÓN DÂU' },
  { time: '13:00 · 28/11', title: 'LỄ THÀNH HÔN' }
];

testItems.forEach((item, idx) => {
  console.log(`Node ${idx + 1}: time="${item.time}" (13px normal), title="${item.title}" (16px bold)`);
});
