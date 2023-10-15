import './App.css'
import { ChakraProvider } from '@chakra-ui/react'
import Home from './components/home'

function App() {
  return (
    <ChakraProvider>
      <Home />
    </ChakraProvider>
  )
}

export default App
