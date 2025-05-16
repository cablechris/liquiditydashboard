import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/');
  }, []);
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem',
      fontFamily: 'sans-serif'
    }}>
      <h1>Liquidity Dashboard</h1>
      <p>Loading...</p>
    </div>
  );
} 