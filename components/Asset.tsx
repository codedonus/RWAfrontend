import { AssetProps } from "@/types";

const Asset: React.FC<AssetProps> = ({ tokenId }) => {
  return (
    <div>
      Asset {tokenId}
    </div>
  )
}

export default Asset;