import { FaComment, FaHeart, FaShareAlt, FaUserAlt } from "react-icons/fa";
import { IoCart } from "react-icons/io5";
import { MdPayment, MdSecurity } from "react-icons/md";


export const languages = ['Vietnamese', 'English']
export const currencies = ["VND", "Token"]
export const shopName = "Phoenix Shop"
export const supportPhone = "+84 386 986 165"
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
    {
      icon: FaShareAlt,
      title: "introduce_friends",
      href: "/user/affiliate",
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
    }
  ]