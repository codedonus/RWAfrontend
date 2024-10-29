import Project from './Feature';
import SectionTitle from './SectionTitle';

const Features = () => {
	return (
		<div
			id='projects'
			className='relative w-full bg-neutral-100 px-[10vw] pb-36 2xl:px-[12.5vw]'>
			<SectionTitle title='Features' />
			<div className='flex flex-col gap-[70px] xl:gap-[90px]'>
				<Project
					name='Starknet'
					desc='Starknet is a groundbreaking Layer 2 scaling solution powered by STARK proof technology, offering unparalleled security and scalability for Ethereum. With its innovative zero-knowledge architecture, Starknet enables massive transaction throughput while maintaining decentralization and security. The platform features a robust smart contract ecosystem, making it ideal for building next-generation decentralized applications.'
					stack={['Layer 2', 'Zero Knowledge', 'Smart Contract']}
					links={[
						['github', 'https://github.com/starknet-io'],
						['external', 'https://www.starknet.io/'],
					]}
					images={['/images/starknet/website.png','/images/starknet/github.png']}
				/>
				<div className='my-3 h-[1px] w-full bg-neutral-300'></div>
				<Project
					name='Real Word Assets'
					desc='Tokenized real-world assets (RWAs) are blockchain-based digital tokens that represent physical and traditional financial assets, such as cash, commodities, equities, bonds, credit, artwork, and intellectual property. The tokenization of RWAs marks a significant shift in how these assets can be accessed, exchanged, and managed, unlocking an array of new opportunities for both blockchain-powered financial services and a wide variety of non-financial use cases underpinned by cryptography and decentralized consensus.'
					stack={['RWA', 'NFT', 'Smart Contract']}
					links={[
						['github'],
						['external', 'https://chain.link/education-hub/real-world-assets-rwas-explained'],
					]}
					images={['/images/rwa/image.png']}
				/>
				<div className='my-3 h-[1px] w-full bg-neutral-300'></div>
				<Project
					name='Fractional NFT'
					desc='Fractional NFTs are a new way to tokenize and fractionalize physical assets like real estate, art, and commodities into NFTs, making them more accessible and liquid. Through smart contract technology and robust legal frameworks, we ensure secure, transparent, and compliant asset tokenization. The protocol features automated valuation mechanisms, flexible ownership structures, and seamless trading capabilities, revolutionizing how traditional assets are managed and traded in the digital age.'
					stack={['NFT', 'NFTFi', 'Liquidity']}
					links={[
						['github'],
						['external', 'https://coinmarketcap.com/academy/article/what-are-fractional-nfts-f-nfts-and-how-do-they-work'],
					]}
					images={['/images/fNFT/image.png']}
				/>
			</div>
		</div>
	);
};

export default Features;
