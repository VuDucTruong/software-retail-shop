
// import { useTranslations } from "next-intl";
// import React from "react";
// import { IoFilter } from "react-icons/io5";

// export default function CommentsPage() {
//   const t = useTranslations();
//   const headers = [ t('Time'), t('Content')];
//   return (
//     <div className="flex flex-col gap-4">
//       <h4>{t("my_comments")}</h4>
//       <p>{t("my_comments_description")}</p>

//       <div className="divider"></div>

//       <div className="grid gap-4 grid-cols-3">
//         <CommonTextInput title={t("Content")} placeholder={t("Content")}  helper={null} />
//         <CommonTextInput title={t("from_date")} placeholder={t("from_date")}  helper={null} type="date" />
//         <CommonTextInput title={t("to_date")} placeholder={t("to_date")} helper={null} type="date" />
//       </div>

//       <button className="btn btn-primary w-fit">
//           <IoFilter />
//           {t("Filter")}
//         </button>


//       <CommonTable header={headers} onClick={()=>{}} />
//     </div>
//   );
// }