import { render } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';


test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});
