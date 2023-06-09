import React, { useState } from "react"
import { Paper, Alert, Card, TextField, Button} from '@mui/material';
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, signInWithGoogle } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    try {
      setError("")
      setLoading(true)
      await login(username, password)
      history.push("/")
    } catch {
      setError("Failed to log in")
    }
    setLoading(false)
  }

  return (
    <Card variant="outlined"
    >
          <Paper elevation={1}
          sx =  {{
            p:3,
            display:'flex',
            flexDirection:'column'}}>
          <h2 className="text-center mb-4">Log in to your account</h2>
          {error && 
            <Alert 
              sx = {{ mb: 4 }} 
              severity="error">
                {error}
            </Alert>}
            <TextField
            autoFocus 
            sx = {{ mb: 4 }}
             variant="outlined"
             id="email"
             label="Email"
             onChange={(event) => setUsername(event.target.value)}
            />
            <TextField
            autoComplete='new-password' 
            sx = {{ mb: 4 }} 
              variant="outlined"
              id="password"
              label="Password"
              type="password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button 
            
            onClick={handleSubmit}
            type="submit"
              variant="outlined"
              disabled={loading}> 
              Log In
            </Button>

            <Button onClick={()=>{signInWithGoogle().then(history.push("/"))}}>Sign in with Google</Button>
            </Paper>
      </Card>

  )
}
