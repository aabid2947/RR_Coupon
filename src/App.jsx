"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "./context/ThemeContext";
import CouponDistributor from "./components/CouponDistributor";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  useEffect(() => {
    // Set a cookie to identify this browser session
    if (!document.cookie.includes("session_id")) {
      const sessionId = Math.random().toString(36).substring(2, 15);
      document.cookie = `session_id=${sessionId}; max-age=${60 * 60 * 24 * 7}; path=/;`;
    }
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <CouponDistributor />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </Provider>
    // <div className="text-blue-500 text-xl">hello</div>
  );
}

export default App;
