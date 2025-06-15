
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '@/components/PageLoader';

const DemoPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/demo/dashboard', { replace: true });
    }, [navigate]);

    return <PageLoader />;
};

export default DemoPage;
