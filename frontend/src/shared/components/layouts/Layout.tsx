import { Outlet } from 'react-router-dom'
import TopNav from '@/shared/components/common/TopNav'
import Footer from '@/shared/components/common/Footer'

function Layout() {
    return (
        <div className="flex flex-col w-screen h-screen bg-white">
            <div className="flex flex-col flex-1 max-w-screen-lg w-full h-full mx-auto bg-white">
                <TopNav />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    )
}

export default Layout
