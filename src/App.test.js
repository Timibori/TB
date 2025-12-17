import { render, screen } from '@testing-library/react';
import App from './App';

test('renders tasty bites welcome message', () => {
  render(<App />);
  // We changed this line to look for text that ACTUALLY exists in your app
  const linkElement = screen.getByText(/Welcome to TastyBites/i);
  expect(linkElement).toBeInTheDocument();
});