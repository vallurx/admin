import useSWR from 'swr';
import { User } from '../types';

const useUser = () => {
    const { data, error, mutate } = useSWR<User>('/api/user');

    return {
        user: data,
        error,
        loading: !data && !error,
        mutate
    }
};

export default useUser;