
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
const Layout = ({ showSidebar = false, children }) => {
    return (
        <div className='min-h-screen'>
            <div className='flex min-h-screen'>
                {showSidebar && <Sidebar />}
                <div className='min-w-0 flex-1 flex flex-col'>
                    <Navbar />
                    <main className="min-w-0 flex-1">{children}</main>
                </div>
                
            </div>

        </div>

    )
}

export default Layout
