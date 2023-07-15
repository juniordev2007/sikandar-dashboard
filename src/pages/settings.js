import DasboardHeader from "@/components/common/DasboardHeader";
import Campaigns from "@/components/settings/Campaigns";
import Generate from "@/components/settings/Generate";
import Subcategories from "@/components/settings/Subcategories";
import Vendors from "@/components/settings/Vendors";
import { Grid } from "@mantine/core";

export default function Settings() {
  return (
    <>
      <DasboardHeader title="Settings" />
      <Grid gutter={32}>
        <Grid.Col span={6}>
          <Campaigns />
        </Grid.Col>
        <Grid.Col span={6}>
          <Vendors />
        </Grid.Col>
        <Grid.Col span={6}>
          <Subcategories />
        </Grid.Col>
        <Grid.Col span={6}>
          <Generate />
        </Grid.Col>
      </Grid>
    </>
  );
}
