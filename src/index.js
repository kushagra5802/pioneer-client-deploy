import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "react-query"
// import { ReactQueryDevtools } from 'react-query/devtools'
import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css'
const queryClient = new QueryClient(); 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Router>
    <QueryClientProvider client={queryClient}>
    <App />
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
    </Router>

  </React.StrictMode>
)
