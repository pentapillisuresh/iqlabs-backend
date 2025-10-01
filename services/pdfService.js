const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const reportsDir = path.join(__dirname, '..', 'reports');
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

exports.createCareerPdf = (user, answers) => {
  return new Promise((resolve, reject) => {
    try {
      const filename = `career-report-${user._id}-${Date.now()}.pdf`;
      const filePath = path.join(reportsDir, filename);

      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      doc.fontSize(20).text('Career Counselling Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Name: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      doc.text(`Phone: ${user.phone}`);
      if (user.address) doc.text(`Address: ${user.address}`);
      doc.moveDown();

      doc.fontSize(14).text('Answers', { underline: true });
      doc.moveDown(0.5);

      answers.forEach((a) => {
        doc.fontSize(11).text(`${a.questionId}. ${a.questionText}`);
        doc.fontSize(11).fillColor('blue').text(`Answer: ${a.answer}`);
        doc.moveDown(0.5);
        doc.fillColor('black');
      });

      doc.end();

      writeStream.on('finish', () => {
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
        resolve(`${baseUrl}/reports/${filename}`);
      });

      writeStream.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};
