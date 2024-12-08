import { HarmonyPDFExport } from './pdf-export';

// Test data
const testData = {
  matches: [
    {
      question1: {
        question_text: "How often do you feel nervous?",
        instrument_name: "GAD-7"
      },
      question2: {
        question_text: "Feeling nervous, anxious or on edge",
        instrument_name: "PHQ-9"
      },
      score: 0.85
    }
  ],
  instruments: [
    { name: "GAD-7", questionCount: 7 },
    { name: "PHQ-9", questionCount: 9 }
  ],
  threshold: 70,
  selectedMatches: []
};

async function testPdfGeneration() {
  try {
    const pdfExport = new HarmonyPDFExport();
    const pdfBlob = await pdfExport.generateReport(testData);
    console.log('PDF generated successfully');
    // In a browser environment, you could download the PDF here
  } catch (error) {
    console.error('PDF generation failed:', error);
  }
}

// Run the test
testPdfGeneration();