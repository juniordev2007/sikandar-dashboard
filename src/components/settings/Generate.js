import { useContext, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { v4 as uuid } from "uuid";
import { Button, Flex, Modal, Paper, Select, Space, Table, Text, TextInput, Title } from "@mantine/core";
import { db, timestamp } from "@/utils/firebase";
import dayjs from "dayjs";

// const baseUrl = "http://localhost:5500";
const baseUrl = "https://sikander-spin.netlify.app/";

export default function Generate() {
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [showGeneratedLinkModal, setShowGeneratedLinkModal] = useState("");
  const { vendors, campaigns, subcategories, generatedLinks, fetchGeneratedLinks } = useContext(AppContext);

  const handleCopyGeneratedLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Link Copied!");
  };

  const handleClose = () => {
    setShowGeneratedLinkModal(false);
    setGeneratedLink("");
    setSelectedVendor("");
    setSelectedCampaign("");
    setSelectedSubcategory("");
  };

  const handleGenerate = async () => {
    let mainUrl = new URL(baseUrl);
    if (selectedVendor) {
      mainUrl.searchParams.append("vendor", selectedVendor);
    }
    if (selectedCampaign) {
      mainUrl.searchParams.append("campaign", selectedCampaign);
    }
    if (selectedSubcategory) {
      mainUrl.searchParams.append("subcategory", selectedSubcategory);
    }
    setShowGeneratedLinkModal(true);
    setGeneratedLink(mainUrl.toString());

    const id = uuid();
    await db.collection("generatedLinks").doc(id).set({ id, link: mainUrl.toString(), generatedOn: timestamp });
    fetchGeneratedLinks();
    setSelectedVendor("");
    setSelectedCampaign("");
    setSelectedSubcategory("");
  };

  const handleRemove = async (id) => {
    await db.collection("generatedLinks").doc(id).delete();
    fetchGeneratedLinks();
  };

  return (
    <div>
      <Paper shadow="none" withBorder p="lg" w={400}>
        <Select
          value={selectedCampaign}
          label="Campaign"
          placeholder="Pick one"
          data={campaigns.map((campaign) => ({ value: campaign.name, label: campaign.name }))}
          onChange={(val) => setSelectedCampaign(val)}
        />
        <Space h="sm" />
        <Select
          value={selectedVendor}
          label="Vendor"
          placeholder="Pick one"
          data={vendors.map((vendor) => ({ value: vendor.name, label: vendor.name }))}
          onChange={(val) => setSelectedVendor(val)}
        />{" "}
        <Space h="sm" />
        <Select
          value={selectedSubcategory}
          label="Subcategory"
          placeholder="Pick one"
          data={subcategories.map((subcategory) => ({ value: subcategory.name, label: subcategory.name }))}
          onChange={(val) => setSelectedSubcategory(val)}
        />
        <Space h="xl" />
        <Flex justify="space-between" gap={12}>
          <Button variant="outline" color="gray" style={{ flex: 1 }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            style={{ flex: 1 }}
            disabled={!selectedVendor && !selectedCampaign && !selectedSubcategory}
            onClick={handleGenerate}>
            Generate
          </Button>
        </Flex>
      </Paper>

      <Modal
        centered
        withCloseButton={false}
        opened={showGeneratedLinkModal}
        onClose={handleClose}
        title={
          <Title order={4} fw={600}>
            Generated Link
          </Title>
        }
        padding={16}
        size={550}>
        <Text size={14} color="grey">
          {generatedLink}
        </Text>
        <Space h="xl" />
        <Flex justify="space-between" gap={12}>
          <Button variant="outline" color="gray" style={{ flex: 1 }} onClick={handleClose}>
            Close
          </Button>
          <Button style={{ flex: 1 }} onClick={() => handleCopyGeneratedLink(generatedLink)}>
            Copy
          </Button>
        </Flex>
      </Modal>

      {generatedLinks.length > 0 && (
        <Paper shadow="none" withBorder mt={24}>
          <Table p={20} horizontalSpacing="md" verticalSpacing="md" fontSize={15}>
            <thead>
              <tr>
                <th>Link</th>
                <th>Generated On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {generatedLinks?.map((generatedLink) => (
                <tr key={generatedLink.id}>
                  {console.log(generatedLink)}
                  <td>{generatedLink.link}</td>
                  <td>{dayjs(new Date(generatedLink.generatedOn.seconds * 1000)).format("DD MMM YYYY")}</td>
                  <th>
                    <Button onClick={() => handleCopyGeneratedLink(generatedLink.link)}>Copy</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button color="red" variant="outline" onClick={() => handleRemove(generatedLink.id)}>
                      Remove
                    </Button>
                  </th>
                </tr>
              ))}
            </tbody>
          </Table>
        </Paper>
      )}
    </div>
  );
}
