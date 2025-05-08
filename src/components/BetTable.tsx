import React, { useEffect, useState } from "react";
import { Table, Button, Radio, Spin, Form, DatePicker } from "antd";
import NewBetDrawer from "./NewBetDrawer";
import { OptionType } from "../types/OptionType";
import { getTeams } from "../services/teamService";
import { getAllBets } from "../services/betService";
import { BetType } from "../types/BetType";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

const BetTable: React.FC = () => {
  const [openBetDrawer, setOpenBetDrawer] = useState<boolean>(false);
  const [spinning, setSpinning] = React.useState(false);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >([dayjs().subtract(7, "day"), dayjs()]);
  const [filteredBets, setFilteredBets] = useState<BetType[]>([]);
  const [visibleBets, setVisibleBets] = useState<BetType[]>(filteredBets);
  const [teams, setTeams] = useState<OptionType[]>([]);
  const [bets, setBets] = useState<BetType[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [reload, setReload] = useState<boolean>(false);
  const [form] = Form.useForm();

  const statusOptions = [
    { label: "Red", value: "RED" },
    { label: "Em andamento", value: "OG" },
    { label: "Green", value: "GREEN" },
  ];

  const columns = [
    {
      title: "Jogador",
      dataIndex: "playerName",
      key: "playerName",
    },
    {
      title: "Equipe",
      dataIndex: "teamName",
      key: "teamName",
      filters: teams.map((team) => ({
        text: team.label,
        value: team.label,
      })),
      onFilter: (value: any, record: any) => record.teamName === value,
    },
    {
      title: "Score ",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Odd ",
      dataIndex: "odd",
      key: "odd",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: any) => (
        <Radio.Group
          options={statusOptions}
          optionType="button"
          buttonStyle="solid"
          value={record.status}
          onChange={(e) => handleStatusChange(e.target.value, record.id)}
        />
      ),
    },
    {
      title: "Criado em ",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ];

  const handleStatusChange = (newStatus: string, recordId: number) => {
    setBets((prev) =>
      prev.map((item) =>
        item.id === recordId ? { ...item, status: newStatus } : item
      )
    );
  };

  const exportToExcel = (data: BetType[], fileName: string) => {
    const exportData = data.map((bet) => ({
      Jogador: bet.playerName,
      Equipe: bet.teamName,
      Score: bet.score,
      Tipo: bet.type,
      Valor: bet.value,
      Odd: bet.odd,
      Status: bet.status,
      "Criado em": dayjs(bet.createdAt).format("DD/MM/YYYY HH:mm"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  const openBet = () => {
    form.resetFields();
    setOpenBetDrawer(true);
  };

  const calcularTotal = (betList: BetType[]) => {
    return betList.reduce((total, bet) => {
      const value = Number(bet.value);
      const odd = Number(bet.odd);

      if (isNaN(value)) return total;

      switch (bet.status) {
        case "GREEN":
          return total + value * (isNaN(odd) ? 1 : odd);
        case "OG":
          return total + value;
        default:
          return total;
      }
    }, 0);
  };

  const fetchData = async () => {
    await getTeams()
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => setError(error));

    await getAllBets()
      .then((response) => {
        setBets(response.data);
      })
      .catch((error) => setError(error));
    setSpinning(false);
  };

  useEffect(() => {
    setSpinning(true);
    fetchData();
    setReload(false);
  }, [reload]);

  useEffect(() => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      setFilteredBets(bets);
      return;
    }

    const [start, end] = dateRange;
    const filtered = bets.filter((bet) => {
      const betDate = dayjs(bet.createdAt);
      return (
        betDate.isAfter(start.startOf("day")) &&
        betDate.isBefore(end.endOf("day"))
      );
    });

    setFilteredBets(filtered);
  }, [bets, dateRange]);

  useEffect(() => {
    setVisibleBets(filteredBets);
  }, [filteredBets]);

  return (
    <>
      <Button onClick={() => exportToExcel(visibleBets, "Relatorio")}>
        Exportar para Excel
      </Button>
      <br />
      <br />
      <RangePicker
        value={dateRange}
        onChange={(dates) => {
          setDateRange(dates);
        }}
      />
      <Table
        dataSource={filteredBets}
        columns={columns}
        rowKey="id"
        pagination={false}
        onChange={(_, __, ___, extra) => {
          setVisibleBets(extra.currentDataSource);
        }}
        summary={() => {
          const total = calcularTotal(visibleBets);
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4}>
                <strong>Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <strong>{total.toFixed(2)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5} />
              <Table.Summary.Cell index={6} />
              <Table.Summary.Cell index={7} />
            </Table.Summary.Row>
          );
        }}
      />
      <br />
      <Button type="primary" onClick={openBet}>
        Nova aposta
      </Button>
      <NewBetDrawer
        openDrawer={openBetDrawer}
        setOpenDrawer={setOpenBetDrawer}
        setReload={setReload}
        teamList={teams}
        form={form}
      />
      <Spin spinning={spinning} fullscreen />
    </>
  );
};

export default BetTable;
