const path = require('path'); //Node.js module 4 handling file paths
const fs = require('fs'); //Node.js File System module 4 read/write files
const PDFDocument = require('pdfkit');
const { parentPort } = require('worker_threads'); //Communication channel b/n  worker thread and the main thread in my controller

const exportDir = path.resolve(__dirname, '../../exports'); // wher to save my pdf
if (!fs.existsSync(exportDir)) {
  //chache the folder
  fs.mkdirSync(exportDir); // if nor creat it
}

parentPort.on('message', (bookingData) => {
  try {
    const filePath = path.join(exportDir, `booking_${bookingData.id}.pdf`);
    const doc = new PDFDocument(); //Creates a new PDF document in memory
    const stream = fs.createWriteStream(filePath); //Opens a writable stream to the file path.
    doc.pipe(stream); // Connects the PDF output to the file stream (so the PDF is written directly to disk).

    // PDF content
    doc.fontSize(20).text('Booking Confirmation', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Booking ID: ${bookingData.id}`);
    doc.text(`User: ${bookingData.userName}`);
    doc.text(`Room: ${bookingData.roomName}`);
    doc.text(`Start: ${bookingData.startTime}`);
    doc.text(`End: ${bookingData.endTime}`);

    doc.end();

    stream.on('finish', () => {
      parentPort.postMessage({ success: true, filePath });
    });
  } catch (err) {
    parentPort.postMessage({ success: false, error: err.message });
  }
});
