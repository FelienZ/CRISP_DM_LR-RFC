import Dashboard from './views/Dashboard'
import { ThemeProvider } from './components/ThemeProvider'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">
          <Dashboard />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
