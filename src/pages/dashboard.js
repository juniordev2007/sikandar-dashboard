import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import Papa from "papaparse";
import { db } from "@/utils/firebase";
import { AppContext } from "@/context/AppContext";
import {
  Badge,
  Group,
  TextInput,
  Paper,
  Select,
  Table,
  Button,
  ActionIcon,
  Tooltip,
  Modal,
  Title,
  NumberInput,
  Flex,
  Space,
  Center,
  Loader,
  Checkbox,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import DasboardHeader from "@/components/common/DasboardHeader";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

export default function Dashboard() {
  const [spinsData, setSpinsData] = useState([]);
  const [searchedItems, setSearchedItems] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBonus, setSelectedBonus] = useState("all");
  const [dateRange, setDateRange] = useState([null, null]);
  const [removeDuplicateNumber, setRemoveDuplicateNumber] = useState(false);

  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");

  const [showRegisterUserModal, setShowRegisterUserModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [amount, setAmount] = useState(0);
  const [username, setUserName] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const { vendors, campaigns, subcategories } = useContext(AppContext);

  function removeFilters() {
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedCampaign("all");
    setSelectedBonus("all");
    setDateRange([null, null]);
    setRemoveDuplicateNumber(false);
    setSearchedItems(spinsData);
  }

  function handleCloseModal() {
    setShowRegisterUserModal(false);
    setAmount(0);
    setSelectedId(null);
    setLoading(false);
    setUserName("");
    setName("");
    setLocation("");
    setPhoneNumber("");
  }

  function convertToCSV(data) {
    const csv = Papa.unparse(data);
    return csv;
  }

  const handleCsvDownload = () => {
    let data = searchedItems;
    data = data.map((d) => ({
      name: d?.name ? d?.name : "-",
      username: d?.username ? d?.username : "-",
      phoneNumber: d.phoneNumber.toString(),
      bonus: d.bonus,
      couponCode: d.couponCode || "-",
      campaign: d?.campaign,
      status: d.status,
      location: d?.location ? d?.location : "-",
      timestamp: dayjs(new Date(d.spinnedAt.seconds * 1000)).format("DD MMM YYYY"),
    }));
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "spin_data.csv";
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  function handleFilter({
    query = searchQuery,
    status = selectedStatus,
    campaign = selectedCampaign,
    bonus = selectedBonus,
    startDate = dateRange[0],
    endDate = dateRange[1],
    removeDuplicate = false,
    vendor = selectedVendor,
    subcategory = selectedSubcategory,
  }) {
    const filteredData = spinsData
      ?.filter((data) => {
        if (!query) return true;
        return (
          data?.couponCode?.toLowerCase()?.includes(query?.toLowerCase()) ||
          data?.phoneNumber?.toLowerCase()?.includes(query?.toLowerCase())
        );
      })
      ?.filter((data) => {
        if (status === "all") return true;
        return data?.status === status;
      })
      ?.filter((data) => {
        if (vendor === "all") return true;
        return data?.vendor === vendor;
      })
      ?.filter((data) => {
        if (subcategory === "all") return true;
        return data?.subcategory === subcategory;
      })
      ?.filter((data) => {
        if (campaign === "all") return true;
        return data?.campaign === campaign;
      })
      ?.filter((data) => {
        if (bonus === "all") return true;
        return data?.bonus === bonus;
      })
      ?.filter((data) => {
        console.log(startDate, endDate);
        if (!startDate || !endDate) return true;
        const startTimestamp = new Date(startDate).getTime();
        const endTimestamp = new Date(endDate).getTime();
        const spinnedAt = new Date(data.spinnedAt.seconds * 1000).getTime();
        return spinnedAt >= startTimestamp && spinnedAt < endTimestamp;
      });

    if (removeDuplicate) {
      const uniqueNumbers = new Set();
      const filtered = [];

      for (let i = 0; i < filteredData.length; i++) {
        const phoneNumber = filteredData[i].phoneNumber;
        if (!uniqueNumbers.has(phoneNumber)) {
          uniqueNumbers.add(phoneNumber);
          filtered.push(filteredData[i]);
        }
      }
      setSearchedItems(filtered);
    } else {
      setSearchedItems(filteredData);
    }
  }

  async function fetchSpinData() {
    try {
      const res = await db.collection("spinEntries").orderBy("spinnedAt", "desc").get();
      const data = res.docs.map((doc) => ({
        ...doc.data(),
        campaign: doc.data()?.campaign ? doc.data()?.campaign : "organic",
      }));
      setSpinsData(data);
      setSearchedItems(data);
    } catch (err) {
      console.log(err.message);
      alert("Something went wrong!");
    }
  }

  useEffect(() => {
    fetchSpinData();
  }, []);

  async function handleUpdate() {
    try {
      setLoading(true);
      const res = await db.collection("spinEntries").doc(selectedId).update({
        status: "registered",
        registeredOn: new Date(),
        amount,
        name,
        username,
        location,
        phoneNumber,
      });
      handleCloseModal();
      alert("User resgistered");
      fetchSpinData();
    } catch (err) {
      handleCloseModal();
      console.log(err.message);
      alert("Something went wrong!");
    }
  }

  return (
    <>
      <DasboardHeader title="Spins" />
      <Group mt={24} mb={16} position="left">
        {/* search input */}
        <TextInput
          label="Search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleFilter({ query: e.target.value });
          }}
          icon={<IconSearch size={18} />}
          placeholder="Phone Number or Coupon Code..."
          size="sm"
          w={260}
        />

        {/* status filter */}
        <Select
          placeholder="Filter by status"
          onChange={(val) => {
            setSelectedStatus(val);
            handleFilter({ status: val });
          }}
          label="Filter by status"
          w={160}
          value={selectedStatus}
          data={[
            { value: "pending", label: "Pending" },
            { value: "claimed", label: "Claimed" },
            { value: "registered", label: "Registered" },
            { value: "all", label: "All" },
          ]}
        />

        {/* camppaign filter */}
        <Select
          placeholder="Filter by campaign"
          onChange={(val) => {
            setSelectedCampaign(val);
            handleFilter({ campaign: val });
          }}
          label="Filter by campaign"
          w={160}
          value={selectedCampaign}
          data={[
            ...campaigns.map((campaign) => ({ value: campaign.name.toLowerCase(), label: campaign.name })),
            { value: "all", label: "All" },
          ]}
        />

        {/* bonus filter */}
        <Select
          placeholder="Filter by bonus"
          onChange={(val) => {
            setSelectedBonus(val);
            handleFilter({ bonus: val });
          }}
          label="Filter by bonus"
          w={160}
          value={selectedBonus}
          data={[
            { value: "10%", label: "10%" },
            { value: "10% x 3", label: "10% x 3" },
            { value: "15%", label: "15%" },
            { value: "25%", label: "25%" },
            { value: "50%", label: "50%" },
            { value: "100%", label: "100%" },
            { value: "all", label: "All" },
          ]}
        />

        {/* date range filter */}
        <DatePickerInput
          type="range"
          placeholder="Pick date range"
          label="Date range filter"
          value={dateRange}
          onChange={(val) => {
            setDateRange(val);
            handleFilter({ startDate: val[0], endDate: val[1] });
          }}
          w={150}
          size="sm"
          clearable
          onReset={(val) => {
            setDateRange(val);
            handleFilter({ startDate: val[0], endDate: val[1] });
          }}
          onTimeUpdate={(val) => {
            setDateRange(val);
            handleFilter({ startDate: val[0], endDate: val[1] });
          }}
        />

        {/* Export csv button */}
        <Button onClick={handleCsvDownload} mt={24}>
          Export Csv
        </Button>
      </Group>

      <Group mb={24}>
        {/* camppaign vendor */}
        <Select
          placeholder="Filter by Vendor"
          onChange={(val) => {
            setSelectedVendor(val);
            handleFilter({ vendor: val });
          }}
          label="Filter by Vendor"
          w={160}
          value={selectedVendor}
          data={[
            ...vendors.map((vendor) => ({ value: vendor.name.toLowerCase(), label: vendor.name })),
            { value: "all", label: "All" },
          ]}
        />

        {/* camppaign subcategroy */}
        <Select
          placeholder="Filter by Subcategory"
          onChange={(val) => {
            setSelectedSubcategory(val);
            handleFilter({ subcategory: val });
          }}
          label="Filter by Subcategory"
          w={160}
          value={selectedSubcategory}
          data={[
            ...subcategories.map((subcategory) => ({ value: subcategory.name.toLowerCase(), label: subcategory.name })),
            { value: "all", label: "All" },
          ]}
        />

        <Checkbox
          label="Remove Duplicate Phone Numbers"
          checked={removeDuplicateNumber}
          onChange={() => {
            setRemoveDuplicateNumber(!removeDuplicateNumber);
            handleFilter({ removeDuplicate: !removeDuplicateNumber });
          }}
        />
        <Button onClick={removeFilters}>Remove Filters</Button>
      </Group>

      {!searchedItems && (
        <Center h={450}>
          <Loader />
        </Center>
      )}

      {/* Table */}
      {searchedItems && (
        <Paper shadow="none" withBorder style={{ overflowX: "auto" }}>
          <Table p={20} horizontalSpacing="md" verticalSpacing="md" fontSize={15}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone&nbsp;Number</th>
                <th>Bonus</th>
                <th>Coupon&nbsp;Code</th>
                <th>Amount</th>
                <th>Location</th>
                <th>Status</th>
                <th>Campaign</th>
                <th>Vendor</th>
                <th>Subcategory</th>
                <th>Timestamp</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchedItems.map((item) => (
                <tr key={item.id}>
                  <td>{item?.name || "-"}</td>
                  <td>{item.phoneNumber}</td>
                  <td>{item.bonus}</td>
                  <td>{item.couponCode || "-"}</td>
                  <td>{item?.amount ? "₹" + item?.amount : "-"}</td>
                  <td>{item?.location || "-"}</td>
                  <td>
                    {item.status === "pending" && (
                      <Badge color="red" variant="filled">
                        {item.status}
                      </Badge>
                    )}
                    {item.status === "claimed" && (
                      <Badge color="green" variant="filled">
                        {item.status}
                      </Badge>
                    )}
                    {item.status === "registered" && (
                      <Badge color="violet" variant="filled">
                        {item.status}
                      </Badge>
                    )}
                  </td>
                  <td>{item?.campaign || "organic"}</td>
                  <td>{item?.vendor || "-"}</td>
                  <td>{item?.subcategory || "-"}</td>
                  <td>{dayjs(new Date(item.spinnedAt.seconds * 1000)).format("DD MMM YYYY")}</td>
                  <td>
                    {item.status === "claimed" ? (
                      <Tooltip label="Register User" color="dark" withArrow position="bottom">
                        <ActionIcon
                          size="md"
                          onClick={() => {
                            setSelectedId(item.id);
                            setShowRegisterUserModal(true);
                            setPhoneNumber(item.phoneNumber);
                          }}>
                          <IconPlus size="1.2rem" />
                        </ActionIcon>
                      </Tooltip>
                    ) : (
                      <span />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Paper>
      )}

      <Modal
        centered
        withCloseButton={false}
        opened={showRegisterUserModal}
        onClose={handleCloseModal}
        title={<Title order={3}>Register User</Title>}
        padding={24}>
        <NumberInput
          value={amount}
          onChange={(val) => setAmount(val)}
          placeholder="Deposit Amount"
          label="Deposit Amount"
          withAsterisk
        />
        <Space h="sm" />
        <TextInput
          label="Phone Number"
          value={phoneNumber}
          maxLength={10}
          onChange={(e) => {
            const inputValue = e.target.value;
            const numericInput = inputValue.replace(/\D/g, "");
            setPhoneNumber(numericInput);
          }}
          placeholder="Phone Number"
          size="sm"
        />
        <Space h="sm" />
        <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" size="sm" />
        <Space h="sm" />
        <TextInput
          label="Username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
          size="sm"
        />
        <Space h="sm" />
        <TextInput
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          size="sm"
        />
        <Space h="xl" />
        <Flex justify="space-between" gap={12}>
          <Button variant="outline" color="gray" style={{ flex: 1 }} onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button style={{ flex: 1 }} disabled={!amount} onClick={handleUpdate} loading={loading}>
            Register
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
