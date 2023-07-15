import React, { useContext, useState } from "react";
import { ActionIcon, Button, Flex, Modal, Paper, Space, Table, TextInput, Title, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { AppContext } from "@/context/AppContext";
import { v4 as uuid } from "uuid";
import { db } from "@/utils/firebase";

export default function Campaigns() {
  const [campaignName, setCampaignName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { campaigns, fetchCampaignsData } = useContext(AppContext);

  const handleCloseModal = () => {
    setCampaignName("");
    setShowAddModal(false);
  };

  const handleAdd = async () => {
    try {
      setLoading(true);
      const id = uuid();
      const body = { id, name: campaignName };
      await db.collection("campaigns").doc(id).set(body);
      fetchCampaignsData();
      handleCloseModal();
      setLoading(false);
    } catch (err) {
      console.log(err.message);
      handleCloseModal();
      setLoading(false);
      alert("Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await db.collection("campaigns").doc(id).delete();
      fetchCampaignsData();
    } catch (err) {
      console.log(err.message);
      alert("Something went wrong!");
    }
  };

  return (
    <div>
      <Flex mb={16} justify="space-between" align="center">
        <Title order={4} fw={600}>
          Campaigns
        </Title>
        <Button onClick={() => setShowAddModal(true)}>Add</Button>
      </Flex>
      <Paper shadow="none" withBorder>
        <Table p={20} horizontalSpacing="md" verticalSpacing="md" fontSize={15}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {campaigns?.map((campaign) => (
              <tr key={campaign.id}>
                <td>{campaign.name}</td>
                <td>
                  <ActionIcon onClick={() => handleDelete(campaign.id)}>
                    <IconTrash size="1.125rem" />
                  </ActionIcon>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>

      <Modal
        centered
        withCloseButton={false}
        opened={showAddModal}
        onClose={handleCloseModal}
        title={
          <Title order={4} fw={600}>
            Add Campaign
          </Title>
        }
        padding={16}
        size={360}>
        <TextInput
          label="Campaign Name"
          value={campaignName}
          maxLength={10}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="Campaign Name"
          size="sm"
        />
        <Space h="xl" />
        <Flex justify="space-between" gap={12}>
          <Button variant="outline" color="gray" style={{ flex: 1 }} onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button style={{ flex: 1 }} disabled={!campaignName} onClick={handleAdd} loading={loading}>
            Add
          </Button>
        </Flex>
      </Modal>
    </div>
  );
}
