import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.js'
import React from 'react'
import { GithubProvider } from './githubContext.js'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GithubProvider>
    <Toaster position="top-center" />
    <App />
    </GithubProvider>
  </StrictMode>,
)
