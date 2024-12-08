import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResultsOptions from './ResultsOptions';

// Mock dependencies
jest.mock('react-ga4', () => ({
  event: jest.fn(),
}));

describe('PDF Export', () => {
  const mockProps = {
    resultsOptions: {
      threshold: [70, 100],
      searchTerm: "",
      intraInstrument: false,
    },
    setResultsOptions: jest.fn(),
    makePublicShareLink: jest.fn(),
    saveToMyHarmony: jest.fn(),
    downloadExcel: jest.fn(),
    downloadPDF: jest.fn(),
    ReactGA: { event: jest.fn() },
    toaster: { error: jest.fn() }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders PDF export button', () => {
    render(<ResultsOptions {...mockProps} />);
    expect(screen.getByText('PDF Export')).toBeInTheDocument();
  });

  it('calls downloadPDF when clicking export button', async () => {
    render(<ResultsOptions {...mockProps} />);
    const exportButton = screen.getByText('PDF Export');
    fireEvent.click(exportButton);
    expect(mockProps.downloadPDF).toHaveBeenCalled();
  });

  it('shows error toast when PDF export fails', async () => {
    const errorProps = {
      ...mockProps,
      downloadPDF: jest.fn().mockRejectedValue(new Error('Export failed'))
    };
    render(<ResultsOptions {...errorProps} />);
    const exportButton = screen.getByText('PDF Export');
    fireEvent.click(exportButton);
    expect(mockProps.toaster.error).toHaveBeenCalledWith('Failed to generate PDF report');
  });
});