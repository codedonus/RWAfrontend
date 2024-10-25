import { ButtonProps } from "@/types";

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled }) => {

  return (
    <button className={`rounded-xl px-8 py-3 text-neutral-100 font-[500] transition tracking-wide w-[200px] outline-none bg-blue-600 hover:bg-blue-700`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button;