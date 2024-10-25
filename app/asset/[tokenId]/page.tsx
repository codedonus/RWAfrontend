import Asset from "@/components/Asset";
import { AssetPageProps } from "@/types";

const AssetPage: React.FC<AssetPageProps> = ({ params }) => {
  return (
    <Asset tokenId={params.tokenId} />
  )
}

export default AssetPage;