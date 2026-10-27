import { LoaderIcon } from 'lucide-react'
import { useThemeStore } from "./store/useThemeStore.js";

const PageLoader = () => {
    const { theme } = useThemeStore();
    return (
        <div className="min-h-screen flex justify-center items-center" data-theme={theme}>
            <LoaderIcon className="animate-spin h-12 w-12 text-primary" />
        </div>
    )
}

export default PageLoader
