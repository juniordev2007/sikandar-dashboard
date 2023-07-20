import DasboardHeader from "@/components/common/DasboardHeader";
import Generate from "@/components/settings/Generate";
import React from "react";

export default function Links() {
  return (
    <div>
      <DasboardHeader title="Generate Links" />
      <Generate />
    </div>
  );
}
