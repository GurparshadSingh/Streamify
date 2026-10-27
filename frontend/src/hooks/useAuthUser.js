import { useQuery } from '@tanstack/react-query'
import { getAuthUser } from '../api.js'
const useAuthUser = () => {
    const authUser = useQuery({
        queryKey: ['authUser'],
        queryFn: getAuthUser,
        retry: false, // Disable automatic retries on failure
    });
    return { isLoading: authUser.isLoading, authUser: authUser.data?.data?.user };
}


export default useAuthUser;
