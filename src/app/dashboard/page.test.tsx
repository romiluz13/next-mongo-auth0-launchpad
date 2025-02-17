import { render, screen, waitFor } from '@/lib/test-utils';
import DashboardPage from './page';
import { mockUser, mockFetchResponse, mockFetchError, resetMocks } from '@/lib/test-utils';

describe('DashboardPage', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('renders dashboard with user data', async () => {
    // Mock successful API responses
    mockFetchResponse({
      userData: {
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
      },
      stats: {
        collections: 5,
        documents: 100,
        storageSize: '1MB',
      },
      keys: [
        {
          name: 'Test Key',
          createdAt: '2024-01-01',
        },
      ],
    });

    render(<DashboardPage />);
    
    // Check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Check content after loading
    await waitFor(() => {
      expect(screen.getByText('Welcome to Your Developer Dashboard')).toBeInTheDocument();
    });

    // Check user data
    expect(screen.getByText(/Test User/)).toBeInTheDocument();
    
    // Check stats
    expect(screen.getByText(/Collections: 5/)).toBeInTheDocument();
    expect(screen.getByText(/Documents: 100/)).toBeInTheDocument();
    expect(screen.getByText(/Storage: 1MB/)).toBeInTheDocument();
    
    // Check API keys
    expect(screen.getByText('Test Key')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    mockFetchError(500, 'Failed to fetch data');

    render(<DashboardPage />);

    // Check error state
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('allows generating new API keys', async () => {
    // Mock initial data
    mockFetchResponse({
      userData: {},
      stats: {},
      keys: [],
    });

    render(<DashboardPage />);

    // Click new key button
    await waitFor(() => {
      const newKeyButton = screen.getByText('New Key');
      newKeyButton.click();
    });

    // Fill in key name
    const input = screen.getByPlaceholderText('Enter key name');
    input.value = 'New Test Key';
    input.dispatchEvent(new Event('change'));

    // Mock key generation response
    mockFetchResponse({
      key: 'new-test-key-123',
    });

    // Click generate button
    const generateButton = screen.getByText('Generate Key');
    generateButton.click();

    // Check if key was generated
    await waitFor(() => {
      expect(screen.getByText('new-test-key-123')).toBeInTheDocument();
    });
  });

  it('handles unauthorized access', async () => {
    // Mock unauthorized error
    mockFetchError(401, 'Unauthorized');

    render(<DashboardPage />);

    // Check if unauthorized message is shown
    await waitFor(() => {
      expect(screen.getByText(/unauthorized/i)).toBeInTheDocument();
    });
  });
}); 