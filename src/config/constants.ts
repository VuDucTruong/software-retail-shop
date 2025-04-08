import { FaComment, FaHeart, FaShareAlt, FaUserAlt } from "react-icons/fa";
import { IoCart } from "react-icons/io5";
import { MdPayment, MdSecurity } from "react-icons/md";
import { MdOutlineCategory } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { SiBrandfolder } from "react-icons/si";
import { FiShoppingBag } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { AiOutlineTransaction } from "react-icons/ai";
import { IoHomeOutline } from "react-icons/io5";
import { AdminMenu, AdminMenuItem } from "@/types/admin_menu";

export const languages = ["en", "vi"];
export const currencies = ["VND", "Token"];
export const shopName = "Phoenix Shop";
export const supportPhone = "+84 386 986 165";
export const sortOptions = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price_low" },
  { label: "Price: High to Low", value: "price_high" },
  { label: "a-Z Sorting", value: "az_sorting" },
  { label: "Z-a Sorting", value: "za_sorting" },
]
export const userOptions = [
  {
    icon: FaUserAlt,
    title: "Account",
    href: "/user/profile",
  },
  {
    icon: IoCart,
    title: "order_history",
    href: "/user/orders",
  },
  {
    icon: MdPayment,
    title: "transaction_history",
    href: "/user/transactions",
  },
  {
    icon: MdSecurity,
    title: "pass_security",
    href: "/user/security",
  },
  {
    icon: FaComment,
    title: "my_comments",
    href: "/user/comments",
  },
  {
    icon: FaHeart,
    title: "my_favorites",
    href: "/user/wishlist",
  },
];

export const userProfileOptions = [
  {
    icon: FaUserAlt,
    title: "Account",
    href: "/user/profile",
  },
  {
    icon: FaHeart,
    title: "my_favorites",
    href: "/user/wishlist",
  },
  {
    icon: FaShareAlt,
    title: "introduce_friends",
    href: "/user/affiliate",
  },
];

export const adminMenu: AdminMenu = {
  userSettings: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navDashboard: {
    title: "Dashboard",
    url: "dashboard",
    icon: IoHomeOutline,
  },
  navProduct: {
    title: "Products",
    url: "products",
    items: [
      {
        title: "Products",
        url: "products",
        icon: AiOutlineProduct,
        items: [],
      },
      {
        title: "Categories",
        url: "categories",
        icon: MdOutlineCategory,
        items: [],
      },
      {
        title: "Brands",
        url: "brands",
        icon: SiBrandfolder,
        items: [],
      },
    ],
  },
};
