import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { Dashboard, Students, Assignments, Login } from '@/pages'
import { AuthProvider } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/assignments" element={<Assignments />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
