import { useContext, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { Button, Flex, Modal, Select, Space, Text, TextInput, Title } from "@mantine/core";

// const baseUrl = "http://localhost:5500";
const baseUrl = "https://sikandar-spin.netlify.app/";

export default function Generate() {
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [showGeneratedLinkModal, setShowGeneratedLinkModal] = useState("");

  const { vendors, campaigns, subcategories } = useContext(AppContext);

  const handleCopyGeneratedLink = () => {
    navigator.clipboard.writeText(generatedLink);
    alert("Link Copied!");
  };

  const closeGeneratedLinkModal = () => {
    setShowGeneratedLinkModal(false);
    setGeneratedLink("");
  };

  const handleCloseModal = () => {
    setSelectedVendor("");
    setSelectedCampaign("");
    setSelectedSubcategory("");
    setShowGenerateModal(false);
  };

  const handleGenerate = () => {
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
    setShowGenerateModal(false);
    setShowGeneratedLinkModal(true);
    setGeneratedLink(mainUrl.toString());
  };

  return (
    <div>
      <Button
        onClick={() => {
          setShowGenerateModal(true);
        }}>
        Generate Link
      </Button>
      <Modal
        centered
        withCloseButton={false}
        opened={showGenerateModal}
        onClose={handleCloseModal}
        title={
          <Title order={4} fw={600}>
            Generate Link
          </Title>
        }
        padding={16}
        size={360}>
        <Select
          label="Campaign"
          placeholder="Pick one"
          data={campaigns.map((campaign) => ({ value: campaign.name, label: campaign.name }))}
          onChange={(val) => setSelectedCampaign(val)}
        />
        <Space h="sm" />
        <Select
          label="Vendor"
          placeholder="Pick one"
          data={vendors.map((vendor) => ({ value: vendor.name, label: vendor.name }))}
          onChange={(val) => setSelectedVendor(val)}
        />{" "}
        <Space h="sm" />
        <Select
          label="Subcategory"
          placeholder="Pick one"
          data={subcategories.map((subcategory) => ({ value: subcategory.name, label: subcategory.name }))}
          onChange={(val) => setSelectedSubcategory(val)}
        />
        <Space h="xl" />
        <Flex justify="space-between" gap={12}>
          <Button variant="outline" color="gray" style={{ flex: 1 }} onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            style={{ flex: 1 }}
            disabled={!selectedVendor && !selectedCampaign && !selectedSubcategory}
            onClick={handleGenerate}>
            Generate
          </Button>
        </Flex>
      </Modal>

      <Modal
        centered
        withCloseButton={false}
        opened={showGeneratedLinkModal}
        onClose={closeGeneratedLinkModal}
        title={
          <Title order={4} fw={600}>
            Generate Link
          </Title>
        }
        padding={16}
        size={550}>
        <Text size={14} color="grey">
          {generatedLink}
        </Text>
        <Space h="xl" />
        <Flex justify="space-between" gap={12}>
          <Button variant="outline" color="gray" style={{ flex: 1 }} onClick={closeGeneratedLinkModal}>
            Close
          </Button>
          <Button style={{ flex: 1 }} onClick={handleCopyGeneratedLink}>
            Copy
          </Button>
        </Flex>
      </Modal>
    </div>
  );
}