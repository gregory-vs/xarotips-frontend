import React, { Dispatch, SetStateAction, useState } from "react";
import { Drawer, Form, Input, Select, Space, Button, InputNumber } from "antd";
import type { InputNumberProps } from "antd";
import { OptionType } from "../types/OptionType";
import { getPlayersByTeam } from "../services/playerService";
import { createBet } from "../services/betService";
const { Option } = Select;

interface Props {
  openDrawer: boolean;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  setReload: Dispatch<SetStateAction<boolean>>;
  form: any;
  teamList: OptionType[];
}

const NewBetDrawer: React.FC<Props> = (props: Props) => {
  const [playerList, setPlayerList] = useState<OptionType[]>([]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onFinish = (values: any) => {
    createBet(values);
    props.setOpenDrawer(false);
    props.setReload(true);
  };

  const onTeamChange = async (value: number) => {
    const playerListResponse = await getPlayersByTeam(value);
    console.log(playerListResponse);
    setPlayerList(playerListResponse.data);
  };

  const onClose = () => {
    props.setOpenDrawer(false);
  };

  const onChange: InputNumberProps["onChange"] = (value) => {
    console.log("changed", value);
  };

  return (
    <Drawer
      title="Nova Bet"
      open={props.openDrawer}
      size={"large"}
      onClose={onClose}
    >
      <Form
        {...layout}
        form={props.form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          name="team"
          label="Selecione o Time"
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            placeholder="Selecione o time"
            onChange={onTeamChange}
            options={props.teamList}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          ></Select>
        </Form.Item>
        <Form.Item
          name="player"
          label="Selecione o jogador"
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            placeholder="Selecione o jogador"
            options={playerList}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          ></Select>
        </Form.Item>
        <Form.Item
          name="type"
          label="Selecione a categoria"
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            placeholder="Selecione a categoria"
            options={[
              { label: "Assistencias", value: "AST" },
              { label: "Rebotes", value: "REB" },
              { label: "Pontos", value: "PTS" },
            ]}
          ></Select>
        </Form.Item>
        <Form.Item
          name="score"
          label="Qual a pontuação?"
          rules={[{ required: true }]}
        >
          <InputNumber
            min={1}
            max={100000}
            defaultValue={3}
            onChange={onChange}
          />
        </Form.Item>
        <Form.Item
          name="value"
          label="Qual o valor apostado?"
          rules={[{ required: true }]}
        >
          <InputNumber<string>
            style={{ width: 200 }}
            defaultValue="1"
            min="0"
            max="10000000000000"
            step="0.01"
            onChange={onChange}
            stringMode
          />
        </Form.Item>
        <Form.Item
          name="odd"
          label="Qual a odd?"
          rules={[{ required: true }]}
        >
          <InputNumber<string>
            style={{ width: 200 }}
            defaultValue="1"
            min="0"
            max="10000000000000"
            step="0.01"
            onChange={onChange}
            stringMode
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Enviar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default NewBetDrawer;
