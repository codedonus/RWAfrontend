import Asset from "@/components/Asset";
import FooterApp from "@/components/FooterApp";
import HeaderApp from "@/components/HeaderApp";
import { AssetPageProps } from "@/types";

const AssetPage: React.FC<AssetPageProps> = ({ params }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderApp />
      <Asset tokenId={params.tokenId} />
      <FooterApp />
    </div>
  )
}

export default AssetPage;