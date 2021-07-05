import Image from 'next/image';

export default function GreetingPage() {
  return (
    <div style={{ width: 'fit-content', margin: '0 auto' }}>
      <Image
        src="https://pickk.one/images/icons/logo/logo-clear.png"
        width="300"
        height="70"
        alt="PICKK Logo"
      />
      <h1>Welcome to PICKK Payments!</h1>
    </div>
  );
}
