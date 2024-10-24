"use client";

import Button from "./Button";
import { message, Upload } from "antd";

const Mint: React.FC = () => {

  const handleUpload = (file: any) => {
    console.log(file);
    message.success("Upload success");
    return false;
  }

  return (
    <div>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto border rounded-lg p-4 bg-white drop-shadow-2xl">
            <h1 className="text-2xl font-semibold text-center pt-8">Mint RWA NFT</h1>
            <div className="relative overflow-hidden flex flex-col items-center justify-center gap-18 p-4 w-full">
              <img src="/images/logo_dark.png" alt="" className="w-[80%] h-[80%] object-contain md:w-[300px] lg:w-[300px]" />
            </div>
            <div className="w-full space-x-5 flex items-center justify-center">
              <Upload beforeUpload={handleUpload} showUploadList={false} maxCount={1}>
                <Button>Upload JSON</Button>
              </Upload>
              <Button>
                Mint
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mint;