import { useRoutes } from "react-router-dom"
import { routes } from "@/config/routes"
import { AppProvider } from "@/provider/AppProvider"

function App() {
    return (
        <AppProvider>
            {useRoutes(routes)}
        </AppProvider>
    )
}

export default App
