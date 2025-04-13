
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Create a root and render the App within it
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);
root.render(<App />);
