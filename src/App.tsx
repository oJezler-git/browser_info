/**
 * YourInfo - Privacy Awareness Dashboard
 * Redesigned Interface
 */

import { Dashboard } from "./components/Dashboard";
import { useWebSocket } from "./hooks/useWebSocket";
import "./App.css";

export default function App() {
  const { connected, currentVisitor } = useWebSocket();

  // For this version we mainly focus on the current user unless an admin view is needed.
  // But strictly following the prompt: "Show only data in a more presentable way".
  // So we default to the current visitor.

  return (
    <div className="app">
      <Dashboard
        visitor={currentVisitor}
        loading={!connected && !currentVisitor}
      />
    </div>
  );
}
