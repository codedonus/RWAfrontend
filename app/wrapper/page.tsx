import FooterApp from "@/components/FooterApp";
import HeaderApp from "@/components/HeaderApp";
import Wrapper from "@/components/Wrapper";

const WrapperPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderApp />
      <Wrapper />
      <FooterApp />
    </div>
  )
}

export default WrapperPage;