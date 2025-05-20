import { FaBlog, FaComment, FaHeart, FaMoneyCheck, FaShareAlt, FaUserAlt } from "react-icons/fa";
import { IoCart, IoKeySharp } from "react-icons/io5";
import { MdPayment, MdSecurity } from "react-icons/md";
import { MdOutlineCategory } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { IoHomeOutline } from "react-icons/io5";
import { BiSolidDiscount } from "react-icons/bi";
import { LuShoppingBag } from "react-icons/lu";
import { RiFolderUserLine } from "react-icons/ri";
import { IconType } from "react-icons/lib";
import { LogOut } from "lucide-react";

export type AdminMenuItem = {
    title: string;
    url: string;
    icon?: IconType;
    items?: AdminMenuItem[];
}

export type AdminUserSettings = {
    name: string;
    email: string;
    avatar: string;
}

export const Role = {
  ADMIN: {
    weight: 999,
    value: "ADMIN",
  },
  STAFF: {
    weight: 100,
    value: "STAFF",
  },
  CUSTOMER: {
    weight: 1,
    value: "CUSTOMER",
  },
}

export type AdminMenu = {
    userSettings: AdminUserSettings;
    navDashboard: AdminMenuItem;
    navProduct: AdminMenuItem;
    navCustomer: AdminMenuItem;
    navStaff: AdminMenuItem;
    navAdmin: AdminMenuItem;
  };
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


export const adminMenu: AdminMenu = {
  userSettings: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navDashboard: {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: IoHomeOutline,
  },
  navProduct: {
    title: "Products",
    url: "products",
    items: [
      {
        title: "Products",
        url: "/admin/products",
        icon: AiOutlineProduct,
        items: [],
      },
      {
        title: "Categories",
        url: "/admin/categories",
        icon: MdOutlineCategory,
        items: [],
      },
      {
        title: "Coupons",
        url: "/admin/coupons",
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
        title: "Customers",
        url: "/admin/customers",
        icon: RiFolderUserLine,
        items: [],
      },
      {
        title: "Orders",
        url: "/admin/orders",
        icon: LuShoppingBag,
        items: [],
      },
      {
        title: "Transactions",
        url: "/admin/transactions",
        icon: FaMoneyCheck,
        items: [],
      },
      {
        title: "Comments",
        url: "/admin/comments",
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
        url: "/admin/blogs",
        icon: FaBlog,
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
        url: "/admin/staffs",
        icon: MdSecurity,
        items: [],
      },
      {
        title: "Product Keys",
        url: "/admin/keys",
        icon: IoKeySharp,
        items: [],
      },
    ],
  }
};


export const regions = [
  { label: "Global", value: "global" },
  { label: "ROW", value: "row" },
  { label: "NA/US", value: "na/us" },
  { label: "SEA", value: "sea" },
  { label: "CN", value: "cn" },
]