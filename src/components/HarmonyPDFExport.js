import PDFDocument from 'pdfkit';
import { format } from 'date-fns';

export class HarmonyPDFExport {
  constructor() {
    this.doc = new PDFDocument({
      margin: 50,
      size: 'A4'
    });
  }

  /**
   * Generate a PDF report of harmonization results
   * @param {Object} data Harmonization matches and metadata
   * @returns {Promise<Buffer>} PDF document as a buffer
   */
  async generateReport(data) {
    const {
      matches,
      instruments,
      timestamp = new Date(),
      threshold,
      selectedMatches = []
    } = data;

    // Add header
    this.addHeader();
    
    // Add summary section
    this.addSummary({
      totalMatches: matches.length,
      selectedMatches: selectedMatches.length,
      instrumentCount: instruments.length,
      threshold,
      timestamp
    });

    // Add instruments overview
    this.addInstrumentsOverview(instruments);

    // Add matches table
    this.addMatchesTable(matches, selectedMatches);

    // Return the PDF as a buffer
    return new Promise((resolve) => {
      const chunks = [];
      this.doc.on('data', chunk => chunks.push(chunk));
      this.doc.on('end', () => resolve(Buffer.concat(chunks)));
      this.doc.end();
    });
  }

  addHeader() {
    this.doc
      .fontSize(24)
      .text('Harmony Data Report', { align: 'center' })
      .moveDown();
  }

  addSummary({ totalMatches, selectedMatches, instrumentCount, threshold, timestamp }) {
    this.doc
      .fontSize(14)
      .text('Summary', { underline: true })
      .moveDown(0.5)
      .fontSize(12)
      .text(`Generated: ${format(timestamp, 'PPpp')}`)
      .text(`Total Instruments: ${instrumentCount}`)
      .text(`Total Matches: ${totalMatches}`)
      .text(`Selected Matches: ${selectedMatches}`)
      .text(`Match Threshold: ${threshold}%`)
      .moveDown();
  }

  addInstrumentsOverview(instruments) {
    this.doc
      .fontSize(14)
      .text('Instruments', { underline: true })
      .moveDown(0.5)
      .fontSize(12);

    instruments.forEach(instrument => {
      this.doc
        .text(`${instrument.name}:`, { continued: true })
        .text(` ${instrument.questionCount} questions`)
        .moveDown(0.5);
    });
    
    this.doc.moveDown();
  }

  addMatchesTable(matches, selectedMatches) {
    this.doc
      .fontSize(14)
      .text('Matches', { underline: true })
      .moveDown(0.5);

    // Table headers
    const startX = this.doc.x;
    const startY = this.doc.y;
    let currentY = startY;

    this.doc.fontSize(10);

    matches.forEach((match, index) => {
      // Check if we need a new page
      if (currentY > 700) {
        this.doc.addPage();
        currentY = 50;
      }

      const isSelected = selectedMatches.includes(match.id);
      
      // Draw match row
      this.doc
        .fillColor(isSelected ? '#666666' : '#000000')
        .text(`Match ${index + 1}`, startX, currentY)
        .text(`${match.score.toFixed(2)}%`, startX + 350, currentY)
        .moveDown(0.5);

      // Question details
      this.doc
        .text(`Question 1: ${match.question1}`, { indent: 20 })
        .text(`Question 2: ${match.question2}`, { indent: 20 })
        .text(`Instruments: ${match.instrument1} ↔ ${match.instrument2}`, { indent: 20 })
        .moveDown();

      currentY = this.doc.y;
    });
  }
}