"use client";

import Button from "./Button";
import { RcFile } from "antd/es/upload";
import type { FormProps } from "antd";
import { AssetType, type FieldType, type RWAType } from "@/types";
import { message, Upload, Form, Modal, Input, Button as AntButton, Select, InputNumber, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Abi, CairoCustomEnum, Contract, RpcProvider } from "starknet";
import { StarknetTypedContract, useAccount, useContract, useNetwork, useReadContract, useSendTransaction } from "@starknet-react/core";
import { Chain } from "@starknet-react/chains";
import { defaultRWAMetadata as defaultValues } from "@/constants";
import { useAbi } from '@/hooks/useAbi';

const Mint: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<string>("");
  const [form] = Form.useForm();
  const [mainForm] = Form.useForm();
  const [NFTFile, setNFTFile] = useState<RcFile[]>([]);
  const [completeValues, setCompleteValues] = useState<RWAType>(defaultValues);

  const { address, account } = useAccount();
  const { chain } = useNetwork();

  const { abi: abiOfNFT, error: abiError } = useAbi(process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RWA_ADDRESS as `0x${string}`);

  // Use abiOfNFT instead of the state variable
  const { contract } = useContract({
    address: process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RWA_ADDRESS as `0x${string}`,
    abi: abiOfNFT as Abi,
  });

  const { send, error, isPending, isSuccess } = useSendTransaction({ 
    calls: 
      contract && address 
        ? [contract.populate("mint", [completeValues])] 
        : undefined, 
  }); 

  const { data: tokenId, error: readError } = useReadContract({
    address: process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RWA_ADDRESS as `0x${string}`,
    abi: abiOfNFT as Abi,
    functionName: "totalSupply",
    args: [],
    watch: true,
  })

  // 深度合并函数
  const deepMerge = <T extends Record<string, unknown>>(defaultObj: T, userObj: Partial<T>): T => {
    return Object.keys(defaultObj).reduce((acc: T, key: keyof T) => {
      const defaultValue = defaultObj[key];
      const userValue = userObj[key];

      if (key === 'asset_type' && defaultValue && typeof defaultValue === 'object' && 'variant' in defaultValue) {
        acc[key] = (userValue ?? defaultValue) as T[keyof T];
      } else if (defaultValue && typeof defaultValue === 'object' && !Array.isArray(defaultValue)) {
        const mergedValue = deepMerge(
          defaultValue as Record<string, unknown>,
          (userValue || {}) as Record<string, unknown>
        );
        acc[key] = mergedValue as T[keyof T];
      } else {
        acc[key] = (userValue !== undefined ? userValue : defaultValue) as T[keyof T];
      }
      return acc;
    }, {} as T);
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    // Convert asset_type to CairoCustomEnum
    let asset_type_enum: CairoCustomEnum | undefined;
    if (values.asset_type) {
      asset_type_enum = new CairoCustomEnum({ [values.asset_type]: {} });
    }

    // Convert dates to string format
    if (values.asset_details) {
      if (values.asset_details.issued_date) {
        values.asset_details.issued_date = values.asset_details.issued_date.toString();
      }
      if (values.asset_details.expiry_date) {
        values.asset_details.expiry_date = values.asset_details.expiry_date.toString();
      }
    }
    
    const RWAValues: Partial<RWAType> = {
      ...values,
      asset_type: asset_type_enum
    };

    const completeValues = deepMerge(defaultValues, RWAValues);
    
    setCompleteValues(completeValues);
    console.log('completeValues: ', completeValues, 'defaultValues: ', defaultValues, 'values: ', RWAValues);
    console.log("address", address);
    send();
    // const CAstrkjs = new Contract(abiOfNFT as Abi, process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RWA_ADDRESS as `0x${string}`);
    // const call = contract.populate("mint", [completeValues]);
    // console.log('call: ', call);
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log(errorInfo);
  }

  const showModal = (field: string) => {
    setCurrentField(field);
    setIsModalVisible(true);
  };

  // Modal Form Submit
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const currentValues = mainForm.getFieldsValue();
        let updatedValues;
        if (currentField === 'issuer' || currentField === 'asset_details') {
          updatedValues = {
            ...currentValues,
            [currentField]: {
              ...currentValues[currentField],
              ...values
            }
          };
        } else {
          updatedValues = {
            ...currentValues,
            [currentField]: values
          };
        }
        mainForm.setFieldsValue(updatedValues);
        console.log(updatedValues);
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const beforeUpload = async (file: RcFile) => {
    console.log(file)
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload png or jpg file!');
    }
    return isJpgOrPng;
  }

  useEffect(() => {
    if (abiError) {
      console.error('Failed to fetch ABI:', abiError);
      // Handle the error (e.g., show an error message to the user)
    }
  }, [abiError]);

  // 监听abiOfNFT、address、completeValues的变化
  useEffect(() => {
    console.log('isSuccess: ', isSuccess, 'isPending: ', isPending, 'tokenId: ', tokenId ? Number(tokenId) - 1 : undefined);
    if (isSuccess) {
      message.success('Minted successfully');
    }
  }, [isSuccess, isPending, tokenId]);


  // Mint成功之后，tokenId会更新，所以需要监听tokenId的变化
  useEffect(() => {
    if (isSuccess) {
      // Submit to backend
      fetch('/api/add_nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_address: address,
          token_id: Number(tokenId) - 1,
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          console.log('Token ID added successfully:', data.data);
        } else {
          console.error('Error adding token ID:', data.error);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }, [tokenId, isSuccess])

  return (
    <div>
      <div>
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto border rounded-lg p-4 bg-white drop-shadow-2xl">
            <h1 className="text-2xl font-semibold text-center pt-8">Mint RWA NFT</h1>
            <div className="relative overflow-hidden flex flex-col items-center justify-center gap-18 p-4 w-full">
              <Form
                form={mainForm}
                name="upload"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="horizontal"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 25 }}
              >
                <Form.Item<FieldType>
                  name="name" 
                  label="Name" 
                  rules={[{ required: true, message: 'Please enter name of RWA NFT' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType>
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: 'Please enter description of RWA NFT' }]}
                >
                  <Input.TextArea rows={1} />
                </Form.Item>

                <Form.Item<FieldType>
                  name="image"
                  label="Image"
                  rules={[{ required: true, message: 'Please upload image of RWA NFT' }]}
                >
                  <Upload.Dragger
                    beforeUpload={beforeUpload}
                    action='https://api.pinata.cloud/pinning/pinFileToIPFS' 
                    headers={{
                      Pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY as string, 
                      Pinata_secret_api_key:process.env.NEXT_PUBLIC_PINATA_API_SECRET as string 
                    }} 
                    maxCount={1} 
                    listType="picture-card"
                    fileList={NFTFile}
                    onChange={({ fileList, file }) => {
                      setNFTFile(fileList as RcFile[]);
                      if (file.status === 'done' && file.response) {
                        const imageHash = file.response.IpfsHash;
                        mainForm.setFieldsValue({ image: imageHash });
                      }
                    }}
                  >
                    <div>
                      <UploadOutlined />
                      <div className='mt-2'>
                          上传
                      </div>
                    </div>
                  </Upload.Dragger>
                </Form.Item>

                <Form.Item<FieldType>
                  name="external_url"
                  label="External URL"
                  rules={[{ required: false }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType>
                  name="asset_id"
                  label="Asset ID"
                  rules={[{ required: false }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType>
                  name="issuer"
                  label="Issuer"
                >
                  <AntButton onClick={() => showModal("issuer")}>
                    Click to add
                  </AntButton>
                </Form.Item>

                <Form.Item<FieldType>
                  name="asset_type"
                  label="Asset Type"
                  rules={[{ required: true, message: 'Please select asset type of RWA NFT' }]}
                >
                  <Select>
                    <Select.Option value="Cash">Cash</Select.Option>
                    <Select.Option value="Commodity">Commodity</Select.Option>
                    <Select.Option value="Stock">Stock</Select.Option>
                    <Select.Option value="Bond">Bond</Select.Option>
                    <Select.Option value="Credit">Credit</Select.Option>
                    <Select.Option value="Art">Art</Select.Option>
                    <Select.Option value="IntellectualProperty">Intellectual Property</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item<FieldType>
                  name="asset_details"
                  label="Asset Details"
                >
                  <AntButton onClick={() => showModal("asset_details")}>
                    Click to add
                  </AntButton>
                </Form.Item>

                <Form.Item>
                  <div className="w-full space-x-5 flex items-center justify-center">
                    <AntButton htmlType="submit" className={`rounded-xl px-8 py-3 text-neutral-100 font-[500] transition tracking-wide w-[200px] h-12 outline-none flex justify-center items-center ${isSuccess ? 'bg-amber-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                      {isPending ? "Mingting" : isSuccess ? "Minted" : "Mint"}
                    </AntButton>
                  </div>
                </Form.Item>

              </Form>
            </div>
          </div>
        </div>
      </div>

      <Modal title="Add Details" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical" initialValues={{ remember: true }} preserve={false}>
          {currentField === "issuer" && (
            <>
              <Form.Item name={['name']} label="Name" rules={[{ required: false }]}>
                <Input />
              </Form.Item>
              <Form.Item name={['contact']} label="Contact" rules={[{ required: false }]}>
                <Input />
              </Form.Item>
              <Form.Item name={['certification']} label="Certification" rules={[{ required: false }]}>
                <Input />
              </Form.Item>
            </>
          )}
          {currentField === "asset_details" && (
            <>
              <Form.Item name={['location']} label="Location" rules={[{ required: false }]}>
                <Input />
              </Form.Item>
              <Form.Item name={['legal_status']} label="Legal Status" rules={[{ required: false }]}>
                <Input />
              </Form.Item>
              <Form.Item 
                label="Valuation"
                required={false}
                className="flex flex-row gap-4"
                layout="horizontal"
              >
                <Form.Item name={['valuation', 'currency']} label="Currency" rules={[{ required: false }]} layout="horizontal">
                  <Select>
                    <Select.Option value="CNY">CNY</Select.Option>
                    <Select.Option value="USD">USD</Select.Option>
                    <Select.Option value="EUR">EUR</Select.Option>
                    <Select.Option value="GBP">GBP</Select.Option>
                    <Select.Option value="JPY">JPY</Select.Option>
                    <Select.Option value="AUD">AUD</Select.Option>
                    <Select.Option value="CAD">CAD</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name={['valuation', 'amount']} label="Amount" rules={[{ required: false }]} layout="horizontal">
                  <InputNumber min={0} />
                </Form.Item>
              </Form.Item>
              <Form.Item name={['issued_date']} label="Issued Date" rules={[{ required: false }]}>
                <DatePicker />
              </Form.Item>
              <Form.Item name={['expiry_date']} label="Expiry Date" rules={[{ required: false }]}>
                <DatePicker />
              </Form.Item>
              <Form.Item name={['condition']} label="Condition" rules={[{ required: false }]}>
                <Input />
              </Form.Item>
              <Form.Item name={['dimensions']} label="Dimensions" rules={[{ required: false }]}>
                <Input />
              </Form.Item>
              <Form.Item name={['material']} label="Material" rules={[{ required: false }]}>
                <Input />
              </Form.Item>
              <Form.Item name={['color']} label="Color" rules={[{ required: false }]}>
                <Input />
              </Form.Item>
              <Form.Item name={['historical_significance']} label="Historical Significance" rules={[{ required: false }]}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                label="Document"
                required={false}
                layout="horizontal"
              >
                <Form.Item name={['document', 'document_name']} label="Name" rules={[{ required: false }]} layout="horizontal">
                  <Input />
                </Form.Item>
                <Form.Item name={['document', 'document_type']} label="Type" rules={[{ required: false }]} layout="horizontal">
                  <Input />
                </Form.Item>
                <Form.Item name={['document', 'document_url']} label="URL" rules={[{ required: false }]} layout="horizontal">
                  <Input />
                </Form.Item>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default Mint;
