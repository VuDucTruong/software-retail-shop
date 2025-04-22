import { FaBlog, FaComment, FaHeart, FaMoneyCheck, FaQuestion, FaShareAlt, FaUserAlt } from "react-icons/fa";
import { IoCart } from "react-icons/io5";
import { MdPayment, MdSecurity } from "react-icons/md";
import { MdOutlineCategory } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { SiBrandfolder } from "react-icons/si";
import { IoHomeOutline } from "react-icons/io5";
import { AdminMenu } from "@/types/admin_menu";
import { BiSolidDiscount } from "react-icons/bi";
import { LuShoppingBag } from "react-icons/lu";

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
        title: "Coupons",
        url: "coupons",
        icon: BiSolidDiscount,
        items: [],
      },
    ],
  },
  navCustomer: {
    title: "Customers",
    url: "Customers",
    items: [
      {
        title: "Orders",
        url: "orders",
        icon: LuShoppingBag,
        items: [],
      },
      {
        title: "Transactions",
        url: "transactions",
        icon: FaMoneyCheck,
        items: [],
      },
      {
        title: "Comments",
        url: "comments",
        icon: FaComment,
        items: [],
      },
    ]
  },
  navStaff: {
    title: "Staff",
    url: "staff",
    items: [
      {
        title: "Blogs",
        url: "blogs",
        icon: FaBlog,
        items: [],
      },
      {
        title: "FAQs",
        url: "faqs",
        icon: FaQuestion,
        items: [],
      },
    ],
  },
  navAdmin: {
    title: "Admin",
    url: "admin",
    items: [
      {
        title: "Staffs",
        url: "staffs",
        icon: MdSecurity,
        items: [],
      },
    ],
  }
};
