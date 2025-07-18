import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ProductDescriptionInput from "./ProductDescriptionInput";

export default function ProductDescriptionTab() {
  const t = useTranslations();
  const tabs = [
    {
      value: "productDescription.tutorial",
      label: t("Tutorial"),
      hint: t("tutorial_hint"),
    },
    {
      value: "productDescription.description",
      label: t("Description"),
      hint: t("description_hint"),
    },
    {
      value: "productDescription.platform",
      label: t("Platform"),
      hint: t("platform_hint"),
    },
    {
      value: "productDescription.policy",
      label: t("Policy"),
      hint: t("policy_hint"),
    },
    {
      value: "productDescription.info",
      label: t("Infomation"),
      hint: t("info_hint"),
    },
  ];

  return (
    <Tabs defaultValue={tabs[0].value}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <ProductDescriptionInput name={tab.value} hint={tab.hint} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
