import { useRouter } from "next/navigation";
import { WhatsApp } from "@mui/icons-material";

type BuyButtonProps = {
  isLoggedIn: boolean;
  productName: string;
  productId: string;
};

export default function BuyButton({
  isLoggedIn,
  productName,
  productId,
}: BuyButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (isLoggedIn) {
      const message = `اريد شراء المنتج ${productName} (ID: ${productId})`;
      const phone = "963994488858";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank"); // فتح رابط واتساب في نافذة جديدة
    } else {
      router.push("/register");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-white bg-primary hover:bg-primary-dark dark:bg-primary dark:hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-800"
    >
      <WhatsApp /> شراء الان
    </button>
  );
}
